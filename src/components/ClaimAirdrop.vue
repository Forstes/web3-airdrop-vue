<script setup lang="ts">
import { ethers } from "ethers";
import { onMounted, ref } from "vue";
import Spinner from "./Spinner.vue";
import { useWallet } from "@/scripts/wallet";
import contractAbi from "@/abi/merkledrop.json";

const { connect } = useWallet();

onMounted(() => {
  connect()
    .then((signer) => {
      contract = new ethers.Contract(contractAddress, contractAbi, signer);
    })
    .catch((e) => alert(e));
});

// Proof 0xd0162b3414035e4a7ba23ff9fd31427dc1eef95bd0969c73dcb40a42c32ea4e6
const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;
let contract: any;

const isInProcess = ref(false);
const data = ref({ proof: "", reward: "" });

async function claim() {
  if (isInProcess.value) return;
  isInProcess.value = true;

  try {
    const tx = await contract.claim(ethers.utils.parseEther(String(data.value.reward)), [data.value.proof]);
    await tx.wait();
    alert(`Completed, transaction hash: ${tx.hash}`);
  } catch(e) {
    console.log(e)
    alert("Failed to claim reward, check if your proof and amount is correct")
  }

  isInProcess.value = false;
}
</script>

<template>
  <div class="h-full flex items-center justify-center">
    <div class="mb-16 p-8 border border-gray-900 rounded bg-zinc-800 text-center">
      <h1 class="text-white text-lg">Add addresses to airdrop:</h1>

      <span class="my-8 flex flex-wrap justify-between items-center gap-2">
        <label class="text-rose-500">Your proof</label>
        <input class="px-2 py-1 rounded-xl outline-purple-500 text-pink-500" v-model="data.proof" />
      </span>

      <span class="my-8 flex flex-wrap justify-between items-center gap-2">
        <label class="text-rose-500">Reward amount</label>
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
        @click="claim"
      >
        Get my reward
      </button>

      <spinner class="w-6 h-6" v-if="isInProcess" />
    </div>
  </div>
</template>
