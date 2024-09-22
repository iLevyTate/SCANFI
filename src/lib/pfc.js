import { Assistant, Thread } from "experts";
import OpenAI from "openai";
import { MultiAgentQLearning } from './qlearning.ts';
import { refinedWordLists } from './refinedWordLists.ts';

const openai = new OpenAI(process.env.OPENAI_API_KEY);

class PFCAssistant extends Assistant {
  constructor(config) {
    super(config);
  }

  async analyze(input) {
    try {
      const thread = await Thread.create();
      const result = await this.ask(input, thread.id);
      try {
        if (typeof Thread.delete === 'function') {
          await Thread.delete(thread.id);
        } else {
          console.error('Thread.delete is not a function');
        }
      } catch (error) {
        console.error('Error deleting thread:', error);
      }
      return result;
    } catch (error) {
      console.error(`Error in ${this.constructor.name}.analyze:`, error);
      throw error;
    }
  }
}

class DLPFCAssistant extends PFCAssistant {
  constructor(existingAssistant = null) {
    super(existingAssistant || {
      name: "DLPFC Assistant",
      instructions: `You are an expert on the Dorsolateral Prefrontal Cortex (DLPFC).
Focus on executive functions, working memory, and cognitive control.
Provide insights on task complexity, attention allocation, and goal-directed behavior.`,
      model: "gpt-4-0125-preview",
      tools: [{ type: "code_interpreter" }, { type: "file_search" }],
      temperature: 0.7
    });
  }

  static async createInstance() {
    try {
      const assistant = await Assistant.create({
        name: "DLPFC Assistant",
        instructions: `You are an expert on the Dorsolateral Prefrontal Cortex (DLPFC).
Focus on executive functions, working memory, and cognitive control.`,
        model: "gpt-4-0125-preview",
        tools: [{ type: "code_interpreter" }, { type: "file_search" }],
        temperature: 0.7
      });
      return new DLPFCAssistant(assistant);
    } catch (error) {
      console.error("Error creating DLPFCAssistant:", error);
      throw error;
    }
  }
}

class VMPFCAssistant extends PFCAssistant {
  constructor(existingAssistant = null) {
    super(existingAssistant || {
      name: "VMPFC Assistant",
      instructions: `You are an expert on the Ventromedial Prefrontal Cortex (VMPFC).
Focus on emotional regulation, decision-making, and value-based choices.`,
      model: "gpt-4-0125-preview",
      tools: [{ type: "code_interpreter" }, { type: "file_search" }],
      temperature: 0.7
    });
  }

  static async createInstance() {
    try {
      const assistant = await Assistant.create({
        name: "VMPFC Assistant",
        instructions: `You are an expert on the Ventromedial Prefrontal Cortex (VMPFC).
Focus on emotional regulation, decision-making, and value-based choices.`,
        model: "gpt-4-0125-preview",
        tools: [{ type: "code_interpreter" }, { type: "file_search" }],
        temperature: 0.7
      });
      return new VMPFCAssistant(assistant);
    } catch (error) {
      console.error("Error creating VMPFCAssistant:", error);
      throw error;
    }
  }
}

class OFCAssistant extends PFCAssistant {
  constructor(existingAssistant = null) {
    super(existingAssistant || {
      name: "OFC Assistant",
      instructions: `You are an expert on the Orbitofrontal Cortex (OFC).
Focus on reward processing, decision-making, and adaptive behavior.`,
      model: "gpt-4-0125-preview",
      tools: [{ type: "code_interpreter" }, { type: "file_search" }],
      temperature: 0.7
    });
  }

  static async createInstance() {
    try {
      const assistant = await Assistant.create({
        name: "OFC Assistant",
        instructions: `You are an expert on the Orbitofrontal Cortex (OFC).
Focus on reward processing, decision-making, and adaptive behavior.`,
        model: "gpt-4-0125-preview",
        tools: [{ type: "code_interpreter" }, { type: "file_search" }],
        temperature: 0.7
      });
      return new OFCAssistant(assistant);
    } catch (error) {
      console.error("Error creating OFCAssistant:", error);
      throw error;
    }
  }
}

class MPFCAssistant extends PFCAssistant {
  constructor(existingAssistant = null) {
    super(existingAssistant || {
      name: "MPFC Assistant",
      instructions: `You are an expert on the Medial Prefrontal Cortex (MPFC).
Focus on social cognition, self-referential processing, and theory of mind.`,
      model: "gpt-4-0125-preview",
      tools: [{ type: "code_interpreter" }, { type: "file_search" }],
      temperature: 0.7
    });
  }

  static async createInstance() {
    try {
      const assistant = await Assistant.create({
        name: "MPFC Assistant",
        instructions: `You are an expert on the Medial Prefrontal Cortex (MPFC).
Focus on social cognition, self-referential processing, and theory of mind.`,
        model: "gpt-4-0125-preview",
        tools: [{ type: "code_interpreter" }, { type: "file_search" }],
        temperature: 0.7
      });
      return new MPFCAssistant(assistant);
    } catch (error) {
      console.error("Error creating MPFCAssistant:", error);
      throw error;
    }
  }
}

class ACCAssistant extends PFCAssistant {
  constructor(existingAssistant = null) {
    super(existingAssistant || {
      name: "ACC Assistant",
      instructions: `You are an expert on the Anterior Cingulate Cortex (ACC).
Focus on conflict monitoring, error detection, and cognitive control.`,
      model: "gpt-4-0125-preview",
      tools: [{ type: "code_interpreter" }, { type: "file_search" }],
      temperature: 0.7
    });
  }

  static async createInstance() {
    try {
      const assistant = await Assistant.create({
        name: "ACC Assistant",
        instructions: `You are an expert on the Anterior Cingulate Cortex (ACC).
Focus on conflict monitoring, error detection, and cognitive control.`,
        model: "gpt-4-0125-preview",
        tools: [{ type: "code_interpreter" }, { type: "file_search" }],
        temperature: 0.7
      });
      return new ACCAssistant(assistant);
    } catch (error) {
      console.error("Error creating ACCAssistant:", error);
      throw error;
    }
  }
}

class QLearningAssistant extends PFCAssistant {
  constructor(existingAssistant = null) {
    super(existingAssistant || {
      name: "Q-Learning Assistant",
      instructions: `You are an expert in reinforcement learning and prefrontal cortex functions.
Analyze inputs to provide strategies for decision-making in multi-agent environments.`,
      model: "gpt-4-0125-preview",
      tools: [{ type: "code_interpreter" }, { type: "file_search" }],
      temperature: 0.7
    });

    this.qlearning = new MultiAgentQLearning(25 + 5, 5); // 25 base features + 5 agent outputs, 5 actions
  }

  static async createInstance() {
    try {
      const assistant = await Assistant.create({
        name: "Q-Learning Assistant",
        instructions: `You are an expert in reinforcement learning and prefrontal cortex functions.`,
        model: "gpt-4-0125-preview",
        tools: [{ type: "code_interpreter" }, { type: "file_search" }],
        temperature: 0.7
      });
      return new QLearningAssistant(assistant);
    } catch (error) {
      console.error("Error creating QLearningAssistant:", error);
      throw error;
    }
  }
}

const createAssistants = async () => {
  try {
    const dlpfc = await DLPFCAssistant.createInstance();
    const vmpfc = await VMPFCAssistant.createInstance();
    const ofc = await OFCAssistant.createInstance();
    const mpfc = await MPFCAssistant.createInstance();
    const acc = await ACCAssistant.createInstance();
    const qlearning = await QLearningAssistant.createInstance();
    
    return {
      DLPFC: dlpfc,
      VMPFC: vmpfc,
      OFC: ofc,
      MPFC: mpfc,
      ACC: acc,
      QLearning: async (input) => {
        const otherAgentOutputs = {
          DLPFC: await dlpfc.analyze(input),
          VMPFC: await vmpfc.analyze(input),
          OFC: await ofc.analyze(input),
          MPFC: await mpfc.analyze(input),
          ACC: await acc.analyze(input),
        };
        return qlearning.analyze(input, otherAgentOutputs);
      }
    };
  } catch (error) {
    console.error("Error creating assistants:", error);
    throw error;
  }
};

export { createAssistants };
