import { reactive } from "vue";

// Shared state outside of plugin — accessible by both component and composable
export const confirmState = reactive({
  dialog: false,
  title: null,
  message: null,
  options: { type: "error", width: 290 },
  agreeCallback: () => {},
  cancelCallback: () => {},
});

export const confirmPlugin = {
  install(app) {
    const confirm = ({
      title,
      message,
      options = {},
      agree = () => {},
      cancel = () => {},
    }) => {
      confirmState.dialog = true;
      confirmState.title = title;
      confirmState.message = message;
      confirmState.options = Object.assign(
        { type: "error", width: 290 },
        options,
      );
      confirmState.agreeCallback = agree;
      confirmState.cancelCallback = cancel;
    };

    app.provide("confirm", confirm);
    app.config.globalProperties.$confirm = confirm;
  },
};
