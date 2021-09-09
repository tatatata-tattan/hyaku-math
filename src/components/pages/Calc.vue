<template>
  <p v-if="isFinish">終了！！！</p>
  <p>{{ correctMessage }}</p>
  <p>
    計算式 {{ tate[currentPosition[0]] }} + {{ yoko[currentPosition[1]] }} =
  </p>
  <input
    v-model="answer"
    type="number"
    @keypress="calc"
    class="border-solid rounded border-2 border-black p-2 h-12"
  />
</template>

<script lang="ts">
import {
  defineComponent,
  onMounted,
  Ref,
  ref,
  ComputedRef,
  computed,
} from "vue";
import { useStore } from "vuex";

export default defineComponent({
  name: "Calc",
  setup() {
    const store = useStore();

    const answer: Ref<number | null> = ref(null);

    const correctMessage: Ref<string> = ref("");
    const isFinish: Ref<boolean> = ref(false);

    const tate: Ref<number[]> = ref([]);
    const yoko: Ref<number[]> = ref([]);

    const currentPosition: Ref<number[]> = ref([0, 0]);

    const mode: ComputedRef<boolean> = computed(() => {
      return store.getters.getIsPlusMode;
    });

    const calc = (event: KeyboardEvent): void => {
      if (event.code === "Enter") {
        const correct =
          tate.value[currentPosition.value[0]] +
          yoko.value[currentPosition.value[1]];

        if (correct === answer.value) {
          correctMessage.value = "正解！";
          currentPosition.value[0] = currentPosition.value[0] + 1;
          if (currentPosition.value[0] > 9) {
            currentPosition.value[0] = 0;
            currentPosition.value[1] = currentPosition.value[1] + 1;
            if (currentPosition.value[1] > 9) {
              currentPosition.value = [0, 0];
              isFinish.value = true;
            }
          }
        } else {
          correctMessage.value = "残念";
        }

        answer.value = null;
      }
    };

    onMounted(() => {
      tate.value = [...Array(10)].map((_, i) => {
        return Math.floor(Math.random() * 9);
      });
      yoko.value = [...Array(10)].map((_, i) => {
        return Math.floor(Math.random() * 9);
      });
    });

    return {
      correctMessage,
      answer,
      isFinish,
      tate,
      yoko,
      currentPosition,
      calc,
    };
  },
});
</script>

<style scoped>
input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
input[type="number"] {
  -moz-appearance: textfield;
}
</style>
