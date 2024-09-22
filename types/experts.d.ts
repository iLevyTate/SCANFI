declare module 'experts' {
    export class Assistant {
      constructor(config: any);
      static create(config: any): Promise<Assistant>;
      // Add any other methods or properties used in the Assistant class
    }
  
    export class Thread {
      static create(): Promise<{ id: string }>;
      // Add any other methods or properties used in the Thread class
    }
  }