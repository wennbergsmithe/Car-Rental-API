
class ValidationError extends Error {
    constructor(message) {
      super(message);
      this.code = code;
    }
  }
  
export {ValidationError}
