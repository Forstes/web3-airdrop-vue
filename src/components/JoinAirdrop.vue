<script setup lang="ts">
import rpsAbi from "@/abi/merkledrop.json";
import { useWallet } from "@/scripts/wallet";
import { ethers } from "ethers";
import { onMounted, reactive, ref } from "vue";
import { StandardMerkleTree } from "@openzeppelin/merkle-tree";
import Spinner from "./Spinner.vue";

const { connect } = useWallet();

onMounted(() => {
  connect()
    .then((signer) => {
      contract = new ethers.Contract(contractAddress, rpsAbi, signer);
    })
    .catch((e) => alert(e));
});

const contractAddress = "0x842E63D47E59F18515a720A927d6CaD10835F445";
let contract: any;

const isInProcess = ref(false);
const data = ref({ address: "", reward: "" });
const rewards = reactive<any>([]);

function addToAirdrop() {
  rewards.push({ address: data.value.address, reward: data.value.reward });
  //data.value = { address: "", reward: "" };
}

async function apply() {
  if (isInProcess.value) return;
  isInProcess.value = true;

  const values: any[] = [];
  rewards.forEach((el: any) => {
    let tmp = [];
    tmp.push(el.address);
    tmp.push(String(ethers.utils.parseEther(String(el.reward))));
    values.push(tmp);
  });

  const tree = StandardMerkleTree.of(values, ["address", "uint256"]);
  console.log("Merkle Root:", tree.root);

  for (const [i, v] of tree.entries()) {
    const proof = tree.getProof(i);
    console.log("Value:", v);
    console.log("Proof:", proof);
  }

  const tx = await contract.setMerkleRoot(tree.root);
  await tx.wait();
  alert(`Completed, transaction hash: ${tx.hash}`);

  isInProcess.value = false;
}
</script>

<template>
  <div class="h-full flex items-center justify-center">
    <div class="mb-16 p-8 border border-gray-900 rounded bg-zinc-800 text-center">
      <h1 class="text-white text-lg">Add addresses to airdrop:</h1>

      <span class="my-8 flex flex-wrap justify-between items-center gap-2">
        <label class="text-rose-500">Address</label>
        <input class="px-2 py-1 rounded-xl outline-purple-500 text-pink-500" v-model="data.address" />
      </span>

      <span class="my-8 flex flex-wrap justify-between items-center gap-2">
        <label class="text-rose-500">Reward</label>
        <input
          type="number"
          step="0.00001"
          class="px-2 py-1 rounded-xl outline-purple-500 text-pink-500 text-center"
          v-model="data.reward"
        />
      </span>

      <button
        class="mx-auto mt-8 mb-3 px-5 py-2.5 block text-white bg-gradient-to-r from-blue-500 to-pink-400 hover:bg-gradient-to-bl disabled:bg-gradient-to-r disabled:brightness-75 rounded-lg border active:border-2"
        :disabled="isInProcess"
        @click="addToAirdrop"
      >
        Add to airdrop
      </button>

      <table class="text-orange-500 mt-6 py-3 max-h-24 overflow-auto">
        <tbody>
          <tr v-for="r in rewards">
            <td class="pr-5 truncate">{{ r.address }}</td>
            <td>{{ r.reward }}</td>
          </tr>
        </tbody>
      </table>

      <button
        class="mx-auto mt-8 px-5 py-2.5 block text-white bg-gradient-to-r from-pink-500 to-orange-400 hover:bg-gradient-to-bl disabled:bg-gradient-to-r disabled:brightness-75 rounded-lg border active:border-2"
        :disabled="isInProcess"
        @click="apply"
      >
        Apply airdrop
      </button>

      <spinner class="w-6 h-6" v-if="isInProcess" />
    </div>
  </div>
</template>
