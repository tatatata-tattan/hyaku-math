interface State {
  isPlusMode: boolean;
}

const state: State = {
  isPlusMode: true,
};

const actions = {
  updateIsPlusMode({ commit }: any, isPlusMode: boolean): void {
    commit("SET_IS_PLUS_MODE", isPlusMode);
  },
};

const mutations = {
  SET_IS_PLUS_MODE(state: State, isPlusMode: boolean): void {
    state.isPlusMode = isPlusMode;
  },
};

const getters = {
  getIsPlusMode: (state: State) => {
    return state.isPlusMode;
  },
};

export default {
  namespace: true,
  state,
  actions,
  mutations,
  getters,
};
