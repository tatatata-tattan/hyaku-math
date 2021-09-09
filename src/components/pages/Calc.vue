<template>
  <div class="mt-10 flex justify-between items-center">
    <div class="mx-auto">
      <p class="font-bold text-9xl font-serif">
        <span v-show="answerStatus === 1 && !isFinish" class="text-green-700"
          >正</span
        >
        <span v-show="answerStatus === 2 && !isFinish" class="text-blue-800"
          >残</span
        >
        <span v-show="isFinish" class="text-red-600">終</span>
      </p>
    </div>
    <div class="flex-content">
      <button
        v-if="!isStart"
        class="
          mt-10
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
        @click="startHyakuMath"
      >
        開始する
      </button>
      <div v-show="isStart">
        <p class="mb-6 text-4xl font-bold">
          Time: <span v-show="min < 9">0</span>{{ min }}:<span v-show="sec < 9"
            >0</span
          >{{ sec }}:{{ deciSec }}
        </p>
        <p class="mb-2 text-lg text-gray-600 font-bold">
          <span v-if="!isFinish">答えを入力してEnterを押してね</span>
          <span v-if="isFinish">お疲れさまでした！</span>
        </p>
        <table class="border-solid border-4 border-white shadow-2xl">
          <thead>
            <tr>
              <th
                class="
                  border-solid border-4 border-white
                  bg-green-200
                  w-10
                  h-10
                "
              >
                <span v-if="mode">+</span><span v-else>×</span>
              </th>
              <th
                v-for="(num, yokoIndex) of yoko"
                :key="yokoIndex"
                class="
                  border-solid border-4 border-white
                  bg-green-200
                  w-10
                  h-10
                "
              >
                <span v-if="isStart">{{ num }}</span>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(num, tateIndex) of tate" :key="tateIndex">
              <th
                class="
                  border-solid border-4 border-white
                  bg-green-200
                  w-10
                  h-10
                "
              >
                <span v-if="isStart">{{ num }}</span>
              </th>
              <td
                v-for="(_, celIndex) of yoko"
                :key="celIndex"
                class="
                  border-solid border-2 border-white
                  bg-gray-100
                  w-10
                  h-10
                  text-center
                "
                :class="isTarget({ x: celIndex, y: tateIndex })"
              >
                {{ result[celIndex][tateIndex] }}
                <input
                  :id="`input-${celIndex}-${tateIndex}`"
                  v-show="
                    isTarget({ x: celIndex, y: tateIndex }) &&
                    isStart &&
                    !isFinish
                  "
                  v-model="answer"
                  type="number"
                  @keypress="calc"
                  class="
                    bg-red-300
                    w-8
                    h-8
                    text-center
                    font-bold
                    focus-visible:bg-red-300
                  "
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="mx-auto">
      <p class="font-bold text-9xl font-serif">
        <span v-show="answerStatus === 1 && !isFinish" class="text-green-700"
          >解</span
        >
        <span v-show="answerStatus === 2 && !isFinish" class="text-blue-800"
          >念</span
        >
        <span v-show="isFinish" class="text-red-600">了</span>
      </p>
    </div>
  </div>
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

    const isStart: Ref<boolean> = ref(false);

    const answer: Ref<number | null> = ref(null);

    const answerStatus: Ref<number> = ref(0);
    const isFinish: Ref<boolean> = ref(false);

    const tate: Ref<number[]> = ref([]);
    const yoko: Ref<number[]> = ref([]);
    const result: Ref<number[][]> = ref([[]]);

    const positionX: Ref<number> = ref(0);
    const positionY: Ref<number> = ref(0);

    const time: Ref<number> = ref(0);
    const min: Ref<number> = ref(0);
    const sec: Ref<number> = ref(0);
    const deciSec: Ref<number> = ref(0);

    let intervalId: NodeJS.Timer | null = null;

    const mode: ComputedRef<boolean> = computed(() => {
      return store.getters.getIsPlusMode;
    });

    const isTarget = (position: { x: number; y: number }): boolean => {
      if (position.x === positionX.value && position.y === positionY.value) {
        return true;
      } else {
        return false;
      }
    };

    const countUp = (): void => {
      time.value = time.value + 1;
      min.value = Math.floor(time.value / 600);
      sec.value = Math.floor((time.value - min.value * 600) / 10);
      deciSec.value = time.value - (min.value * 600 + sec.value * 10);
    };

    const startHyakuMath = (): void => {
      isStart.value = true;

      intervalId = setInterval(() => {
        countUp();
      }, 100);

      setTimeout(() => {
        document.getElementById("input-0-0")?.focus();
      }, 0);
    };

    const calc = (event: KeyboardEvent): void => {
      if (event.code === "Enter") {
        const correct =
          tate.value[positionY.value] + yoko.value[positionX.value];

        if (correct === answer.value) {
          answerStatus.value = 1;
          result.value[positionX.value][positionY.value] = correct;
          positionX.value = positionX.value + 1;
          if (positionX.value > 9) {
            positionX.value = 0;
            positionY.value = positionY.value + 1;
            if (positionY.value > 9) {
              positionX.value = 0;
              positionY.value = 0;
              isFinish.value = true;
              if (intervalId) {
                clearInterval(intervalId);
                intervalId = null;
              }
            }
          }
        } else {
          answerStatus.value = 2;
        }

        answer.value = null;
        setTimeout(() => {
          document
            .getElementById(`input-${positionX.value}-${positionY.value}`)
            ?.focus();
        }, 0);
      }
    };

    onMounted(() => {
      tate.value = [...Array(10)].map((_, i) => {
        return Math.floor(Math.random() * 9);
      });
      yoko.value = [...Array(10)].map((_, i) => {
        return Math.floor(Math.random() * 9);
      });
      result.value = [...Array(10)].map(() => Array(10).fill(undefined));
      time.value = 0;
    });

    return {
      isStart,
      answerStatus,
      answer,
      isFinish,
      tate,
      yoko,
      result,
      positionX,
      positionY,
      min,
      sec,
      deciSec,
      mode,
      calc,
      isTarget,
      startHyakuMath,
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
:focus:not(.focus-visible) {
  outline: none;
}

:focus:not(:focus-visible) {
  outline: none;
}
</style>
