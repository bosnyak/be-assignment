/* eslint-disable no-param-reassign */

export interface handlerResult<T> {
  status: number
  response: Partial<T>
}

export const createResponseObj = <T>() => {
  const result: handlerResult<T> = {
    status: 0,
    response: {},
  };
  return {
    respObj: {
      json(body: T) {
        result.response = body;
      },
      status(status = 200) {
        result.status = status;
        return this;
      },
    },
    handlerResult: result,
  };
};
