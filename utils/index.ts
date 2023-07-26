export const errorResponse = (err: any) => {
  let msg = "";

  if (err?.response) {
    msg = err?.response?.status + " " + err?.response?.statusText;
    if (err?.response?.data?.message) {
      msg = err?.response?.data?.message;
    }
  } else {
    msg = err;
  }
  return msg;
};

export function downloadFile(
  eData: any,
  type: string,
  fileName: string,
  fileType: string
) {
  if (!eData) return;
  const mBlob = new Blob([eData], { type: type });
  const fileObjURL = URL.createObjectURL(mBlob);
  if (typeof document !== "undefined") {
    const el = document.createElement("a");
    el.setAttribute("href", fileObjURL);
    el.setAttribute("download", fileName + "." + fileType);
    document.body.appendChild(el);
    el.click();
    el.remove();
  }
}
