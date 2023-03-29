<script setup lang="ts">
import { ethers } from "ethers";
import { onMounted, reactive, ref } from "vue";
import { StandardMerkleTree } from "@openzeppelin/merkle-tree";
import Spinner from "./Spinner.vue";
import router from "@/plugins/router";
import { useWallet } from "@/scripts/wallet";
import tokenAbi from "@/abi/token.json";
import contractAbi from "@/abi/merkledrop.json";

const { connect } = useWallet();

onMounted(() => {
  connect()
    .then((signer) => {
      airdropContract = new ethers.Contract(contractAddress, contractAbi, signer);
      tokenContract = new ethers.Contract(tokenAddress, tokenAbi, signer);
    })
    .catch((e) => alert(e));
});

const tokenAddress = import.meta.env.VITE_TOKEN_ADDRESS;
const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;
let airdropContract: any;
let tokenContract: any;

const isInProcess = ref(false);
const data = ref({ address: "", reward: "" });
const rewards = reactive<any[]>([]);

function addToAirdrop() {
  rewards.push({ address: data.value.address, reward: data.value.reward });
  //data.value = { address: "", reward: "" };
}

async function apply() {
  if (isInProcess.value) return;
  isInProcess.value = true;

  let totalReward = 0;
  const values: any[] = [];

  rewards.forEach((el: any) => {
    totalReward += Number(el.reward);
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

  let tx = await airdropContract.setMerkleRoot(tree.root);
  await tx.wait();
  alert(`Completed, transaction hash: ${tx.hash}`);

  // Supply contract with total airdrop sum
  tx = await tokenContract.transfer(contractAddress, ethers.utils.parseEther(String(totalReward.toFixed(5))));
  await tx.wait(3);
  alert(`Airdop funding completed, transaction hash: ${tx.hash}`);

  isInProcess.value = false;
}
</script>

<template>
  <div class="h-full flex items-center justify-center">
    <div class="h-[28rem] mb-16 p-8 border border-gray-900 rounded bg-zinc-800 text-center grid grid-cols-3 gap-3 overflow-auto">
      <div class="col-span-3 md:col-span-1">
        <h1 class="text-white text-lg">Add addresses to airdrop:</h1>

        <span class="my-8 flex flex-wrap justify-center items-center gap-2">
          <label class="text-rose-500">Address</label>
          <input class="px-2 py-1 rounded-xl outline-purple-500 text-pink-500" v-model="data.address" />
        </span>

        <span class="my-8 flex flex-wrap justify-center items-center gap-2">
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

        <button
          class="mx-auto mt-8 px-5 py-2.5 block text-white bg-gradient-to-r from-pink-500 to-orange-400 hover:bg-gradient-to-bl disabled:bg-gradient-to-r disabled:brightness-75 rounded-lg border active:border-2"
          :disabled="isInProcess"
          @click="apply"
        >
          Apply airdrop
        </button>

        <a class="mt-6 block text-blue-500 hover:text-blue-600 cursor-pointer" @click="router.push('/claim')">Go to claims</a>

        <spinner class="mt-3 w-6 h-6" v-if="isInProcess" />
      </div>

      <div class="h-full pl-0 md:pl-8 col-span-3 md:col-span-2">
        <table class="w-full text-orange-500 mt-6 py-3 max-h-24">
          <thead>
            <tr>
              <th class="border w-56">Address</th>
              <th class="border w-24">Reward</th>
            </tr>
          </thead>
          <tbody class="text-sm text-rose-500">
            <tr v-for="r in rewards">
              <td class="border truncate">{{ r.address }}</td>
              <td class="border">{{ r.reward }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
