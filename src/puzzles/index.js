import { DualHandAnchor } from './DualHandAnchor.js';
import { MetaUiTrap } from './MetaUiTrap.js';
import { ReversePsychology } from './ReversePsychology.js';
import { LogicWireCutter } from './LogicWireCutter.js';
import { CrowdCipher } from './CrowdCipher.js';
import { AcousticSensor } from './AcousticSensor.js';

const PUZZLES = {
  dualHand: DualHandAnchor,
  metaTrap: MetaUiTrap,
  reverse: ReversePsychology,
  wires: LogicWireCutter,
  cipher: CrowdCipher,
  acoustic: AcousticSensor,
};

export function createPuzzle(key, scene, ctx) {
  const Cls = PUZZLES[key];
  if (!Cls) throw new Error(`Unknown puzzle module: ${key}`);
  return new Cls(scene, { ...ctx, moduleKey: key });
}

export { PUZZLES };
