import { reactive } from "vue";
import { appWindow } from "@tauri-apps/api/window";

export const MOVE = "MOVE";
export const COPY = "COPY";
export const RENAME = "RENAME";
export const UNLINK = "UNLINK";
export const DELETE = "DELETE";

export const FILESIZE = "FileSize";
export const FILECONTENT = "FileContent";
export const FILENAME = "FileName";
export const FILEEXTENSION = "FileExtension";
export const FOLDERNAME = "FolderName";
export const PATHNAME = "PathName";

export const INCLUDES = "Includes";
export const NOTINCLUDES = "NotIncludes";
export const ISNOT = "IsNot";
export const EXACTMATCH = "ExactMatch";

export const useFetchList = (
  arr: Array<any>,
  low: number = 0,
  high: number = 10
) => {
  let flatten = arr.reduce((acc, val) => {
    return acc.concat(...val.logs);
  }, []);

  return { slice: flatten.slice(low, high), len: flatten.length };
};

interface ResizeEvent {
  event: string;
  id: number;
  payload: {
    width: number;
    height: number;
  };
  windowLabel: string;
}

const resizeCallers = {
  count: 0,
};

let { width, height } = await appWindow.innerSize();

const dimensions = reactive({
  appWindow,
  width: width,
  event: "tauri://resize",
  windowLabel: "",
  height: height,
  id: 0,
  isMaximized: false,
  unlisten: (): void => {},
});

export const useDimensions = () => {
  if (resizeCallers.count <= 0) {
    // limits the amount of resize event listener to 1
    appWindow
      .listen("tauri://resize", async (e: ResizeEvent) => {
        dimensions.isMaximized = await appWindow.isMaximized();
        dimensions.width = e.payload.width;
        dimensions.height = e.payload.height;
        dimensions.windowLabel = e.windowLabel;
        dimensions.event = e.event;
        dimensions.id = e.id;
      })
      .then(
        (unlisten) =>
          (dimensions.unlisten = () => {
            unlisten();
          })
      );
    resizeCallers.count = 1;
  }

  return dimensions;
};
