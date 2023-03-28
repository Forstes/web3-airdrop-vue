import { StandardMerkleTree } from "@openzeppelin/merkle-tree";

const values = [
  ["0x5B38Da6a701c568545dCfcB03FcB875f56beddC4", "50"],
  ["0xCa1745a14299307A7C636e2223f6D1904e5A01B0", "75"],
];

const tree = StandardMerkleTree.of(values, ["address", "uint256"]);
console.log("Merkle Root:", tree.root);

for (const [i, v] of tree.entries()) {
  const proof = tree.getProof(i);
  console.log("Value:", v);
  console.log("Proof:", proof);
}