import { useCallback, useMemo, useState } from 'react';
import { solveKnapsack } from '../algorithms/dynamicProgramming/knapsackDP.js';
import { DEFAULT_CAPACITY, EXAMPLE_CASE, INPUT_LIMITS } from '../constants/config.js';
import {
  createOrder,
  generateRandomOrders,
  suggestWeightRange,
} from '../services/orderGenerator.js';
import { getExecutionWarnings, validateCapacity, validateExecution } from '../utils/validation.js';

export function useKnapsack() {
  const [orders, setOrders] = useState([]);
  const [capacityInput, setCapacityInput] = useState(String(DEFAULT_CAPACITY));
  const [result, setResult] = useState(null);
  const [executionError, setExecutionError] = useState(null);
  const [runCount, setRunCount] = useState(0);

  const { value: capacity, error: capacityError } = useMemo(
    () => validateCapacity(capacityInput),
    [capacityInput],
  );

  const executionWarnings = useMemo(
    () => getExecutionWarnings(orders, capacity),
    [orders, capacity],
  );

  const invalidateResult = useCallback(() => {
    setResult(null);
    setExecutionError(null);
  }, []);

  const addOrder = useCallback(
    (orderData) => {
      setOrders((currentOrders) => [...currentOrders, createOrder(orderData)]);
      invalidateResult();
    },
    [invalidateResult],
  );

  const removeOrder = useCallback(
    (orderId) => {
      setOrders((currentOrders) => currentOrders.filter((order) => order.id !== orderId));
      invalidateResult();
    },
    [invalidateResult],
  );

  const generateOrders = useCallback(
    (count) => {
      const weightRange = suggestWeightRange(capacity ?? DEFAULT_CAPACITY);
      setOrders(generateRandomOrders(count, weightRange));
      invalidateResult();
    },
    [capacity, invalidateResult],
  );

  const updateCapacity = useCallback(
    (nextCapacityInput) => {
      setCapacityInput(nextCapacityInput);
      invalidateResult();
    },
    [invalidateResult],
  );

  const loadExample = useCallback(() => {
    setOrders(EXAMPLE_CASE.orders.map((order) => ({ ...order })));
    setCapacityInput(String(EXAMPLE_CASE.capacity));
    invalidateResult();
  }, [invalidateResult]);

  const runAlgorithm = useCallback(() => {
    const validationError = capacityError ?? validateExecution(orders, capacity);

    if (validationError) {
      setResult(null);
      setExecutionError(validationError);
      return;
    }

    try {
      setResult(solveKnapsack(orders, capacity));
      setExecutionError(null);
      setRunCount((currentCount) => currentCount + 1);
    } catch (error) {
      setResult(null);
      setExecutionError(error.message);
    }
  }, [orders, capacity, capacityError]);

  const resetAll = useCallback(() => {
    setOrders([]);
    setCapacityInput(String(DEFAULT_CAPACITY));
    invalidateResult();
  }, [invalidateResult]);

  const selectedOrderIds = useMemo(
    () => new Set(result?.selectedOrders.map((order) => order.id)),
    [result],
  );

  return {
    orders,
    capacityInput,
    capacity,
    capacityError,
    result,
    executionError,
    executionWarnings,
    runCount,
    selectedOrderIds,
    canAddOrders: orders.length < INPUT_LIMITS.maxOrders,
    canRun: orders.length > 0 && capacityError === null,
    addOrder,
    removeOrder,
    generateOrders,
    updateCapacity,
    loadExample,
    runAlgorithm,
    resetAll,
  };
}
