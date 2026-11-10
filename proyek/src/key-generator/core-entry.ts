import { SELF_TEST_SECRET, SPECS, TYPE_ORDER } from "./spec";
import { computeCheck, effectiveSecret, generateKey, runSelfTest, verifyLikeServer } from "./keys";

(window as unknown as { __keyGen: unknown }).__keyGen = {
  SPECS,
  TYPE_ORDER,
  generateKey,
  verifyLikeServer,
  computeCheck,
  effectiveSecret,
  selfTest: runSelfTest,
  SELF_TEST_SECRET
};
