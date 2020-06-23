import React, { useEffect, useReducer, Reducer } from 'react';

type PromiseState<T> = {
  status: Status;
  data?: T;
  error?: string;
};

type PromiseAction<T> = {
  type: string;
  payload: PromiseState<T>;
  error?: string;
};

type Status = 'loading' | 'loaded' | 'error';

const initialState: PromiseState<any> = {
  status: 'loading',
};

const REQUEST_START = 'REQUEST_START';
const REQUEST_SUCCESS = 'REQUEST_SUCCESS';
const REQUEST_ERROR = 'REQUEST_ERROR';

const reducer = <T>(state: PromiseState<T>, action: PromiseAction<T>) => {
  switch (action.type) {
    case REQUEST_START:
      return {
        status: 'loading' as Status,
      };
    case REQUEST_SUCCESS:
      return {
        status: 'loaded' as Status,
        data: action.payload,
      };
    case REQUEST_ERROR:
      return {
        status: 'error' as Status,
        error: action.error,
      };
    default:
      return state;
  }
};

export const usePromise = <T>(cb: () => Promise<T>): PromiseState<T> => {
  const [promiseState, dispatch] = useReducer<
    Reducer<PromiseState<T>, PromiseAction<T>>
  >(reducer, initialState);

  useEffect(() => {
    (async () => {
      dispatch({ type: REQUEST_START });
      try {
        const data = await cb();
        // console.log('data from usepromise', data);
        dispatch({ type: REQUEST_SUCCESS, payload: data });
      } catch (e) {
        dispatch({ type: REQUEST_ERROR });
      }
    })();
  }, [cb]);

  return promiseState;
};
