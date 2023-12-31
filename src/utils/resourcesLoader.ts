import * as THREE from "three";
//@ts-ignore
import { GLTFLoader, GLTF } from "three/addons/loaders/GLTFLoader.js";
//@ts-ignore
import { RGBELoader } from "three/addons/loaders/RGBELoader.js";

export enum Loader {
  RGBE_LOADER = "rgbeLoader",
  GLTF_LOADER = "gltfLoader",
  TEXTURE_LOADER = "textureLoader",
}

export interface SourceInt {
  type: LoaderType;
  name: string;
  path: string;
}

type FileType = GLTF | THREE.Texture;

interface ResourceItemsInt {
  [key: string]: FileType | undefined;
}
type LoaderType =
  | Loader.GLTF_LOADER
  | Loader.RGBE_LOADER
  | Loader.TEXTURE_LOADER;
interface LoadersInt {
  [Loader.GLTF_LOADER]: GLTFLoader;
  [Loader.RGBE_LOADER]: RGBELoader;
  [Loader.TEXTURE_LOADER]: THREE.TextureLoader;
}

const loaders: LoadersInt = {
  [Loader.GLTF_LOADER]: new GLTFLoader(),
  [Loader.RGBE_LOADER]: new RGBELoader(),
  [Loader.TEXTURE_LOADER]: new THREE.TextureLoader(),
};

export const resourcesLoader = (
  assets: SourceInt[]
): Promise<ResourceItemsInt> => {
  const items: ResourceItemsInt = {};
  const loadPromises: Promise<void>[] = [];

  for (const item of assets) {
    const loader = loaders[item.type];
    const loadPromise = new Promise<void>((resolve) => {
      loader.load(item.path, (file: FileType) => {
        items[item.name] = file;
        resolve();
      });
    });
    loadPromises.push(loadPromise);
  }

  return Promise.all(loadPromises).then(() => {
    const loaderWrapper: HTMLDivElement = document.querySelector(
      ".assets-loader-wrapper"
    )!;
    if (loaderWrapper) loaderWrapper.style.display = "none";
    return items;
  });
};
