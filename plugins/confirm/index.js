import { confirmState } from "../../state.js";
export { confirmState };

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
