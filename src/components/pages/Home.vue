<template>
  <div class="mt-10 mx-auto container">
    <p class="mt-10 text-9xl font-extrabold text-center">100マス計算</p>
    <p class="mt-28 mb-2 text-2xl text-center font-bold">モードを選択する</p>
    <div class="flex justify-center">
      <label class="mr-8 text-xl">
        <input
          v-model="isPlusMode"
          type="radio"
          name="plus"
          :value="true"
          class="mr-2"
        />たし算</label
      >
      <label class="text-xl">
        <input
          v-model="isPlusMode"
          type="radio"
          name="maltiplication"
          :value="false"
          class="mr-2"
        />かけ算</label
      >
    </div>
    <button
      class="
        flex
        justify-center
        mx-auto
        mt-10
        pt-5
        border-solid border-4 border-white
        bg-green-200
        rounded-lg
        shadow-2xl
        h-20
        w-60
        font-bold
        text-2xl
      "
      type="button"
      @click="toCalc"
    >
      問題を開く
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, Ref } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

export default defineComponent({
  name: "Home",
  setup() {
    const store = useStore();
    const router = useRouter();

    const isPlusMode: Ref<boolean> = ref(true);

    const toCalc = (): void => {
      store.dispatch("updateIsPlusMode", isPlusMode.value);
      router.push("/calc");
    };

    onMounted(() => {
      isPlusMode.value = store.getters.getIsPlusMode;
    });

    return {
      isPlusMode,
      toCalc,
    };
  },
});
</script>
