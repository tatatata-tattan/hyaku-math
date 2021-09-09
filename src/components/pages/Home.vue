<template>
  <div class="mt-10 container">
    <p class="text-4xl font-extrabold text-center">100マス計算</p>
    <div class="mt-8 flex justify-center">
      <label class="mr-4">
        <input
          v-model="isPlusMode"
          type="radio"
          name="plus"
          :value="true"
        />足し算</label
      >
      <label>
        <input
          v-model="isPlusMode"
          type="radio"
          name="maltiplication"
          :value="false"
        />掛け算</label
      >
    </div>
    <button
      class="
        flex
        mt-8
        mx-auto
        py-2
        px-3
        rounded
        border-solid border-2 border-black
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
