import * as tf from '@tensorflow/tfjs';

class QNetwork {
  model: tf.LayersModel;

  constructor(stateSize: number, actionSize: number) {
    this.model = tf.sequential({
      layers: [
        tf.layers.dense({ inputShape: [stateSize], units: 64, activation: 'relu' }),
        tf.layers.dense({ units: 64, activation: 'relu' }),
        tf.layers.dense({ units: actionSize, activation: 'linear' })
      ]
    });
    this.model.compile({ optimizer: 'adam', loss: 'meanSquaredError' });
  }

  predict(state: tf.Tensor2D): tf.Tensor2D {
    return this.model.predict(state) as tf.Tensor2D;
  }

  async train(state: tf.Tensor2D, target: tf.Tensor2D): Promise<number> {
    const history = await this.model.fit(state, target, { epochs: 1, verbose: 0 });
    return history.history.loss[0] as number;
  }
}

export class MultiAgentQLearning {
  private qNetworkOnline: QNetwork;
  private qNetworkTarget: QNetwork;
  private stateSize: number;
  private actionSize: number;
  private gamma: number;
  private epsilon: number;
  private epsilonMin: number;
  private epsilonDecay: number;

  constructor(stateSize: number, actionSize: number) {
    this.stateSize = stateSize;
    this.actionSize = actionSize;
    this.qNetworkOnline = new QNetwork(stateSize, actionSize);
    this.qNetworkTarget = new QNetwork(stateSize, actionSize);
    this.gamma = 0.99;
    this.epsilon = 1.0;
    this.epsilonMin = 0.01;
    this.epsilonDecay = 0.995;
  }

  async act(state: number[]): Promise<number[]> {
    if (Math.random() < this.epsilon) {
      return Array.from({ length: this.actionSize }, () => Math.random());
    }
    const stateTensor = tf.tensor2d([state]);
    const qValues = this.qNetworkOnline.predict(stateTensor);
    const action = await qValues.array() as number[][];
    tf.dispose([stateTensor, qValues]);
    return action[0];
  }

  async update(state: number[], action: number[], reward: number, nextState: number[]): Promise<number> {
    const stateTensor = tf.tensor2d([state]);
    const nextStateTensor = tf.tensor2d([nextState]);
    const qValuesNext = this.qNetworkTarget.predict(nextStateTensor);
    const qValuesNextArray = await qValuesNext.array() as number[][];
    const targetQ = await this.qNetworkOnline.predict(stateTensor).array() as number[][];

    const nextMax = Math.max(...qValuesNextArray[0]);
    targetQ[0][action.indexOf(Math.max(...action))] = reward + this.gamma * nextMax;

    const loss = await this.qNetworkOnline.train(stateTensor, tf.tensor2d(targetQ));

    if (this.epsilon > this.epsilonMin) {
      this.epsilon *= this.epsilonDecay;
    }

    tf.dispose([stateTensor, nextStateTensor, qValuesNext]);
    return loss;
  }

  updateTargetNetwork(): void {
    const onlineWeights = this.qNetworkOnline.model.getWeights();
    this.qNetworkTarget.model.setWeights(onlineWeights);
  }
}