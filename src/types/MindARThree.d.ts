declare module "mindar-image-three" {
  import * as THREE from "three";

  export class MindARThree {
    constructor(options: {
      container: HTMLElement;
      imageTargetSrc: string;
      filterMinCF: number;
      filterBeta: number;
      uiLoading?: string;
      uiScanning?: string;
    });

    renderer: THREE.WebGLRenderer;
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    addAnchor(index: number): {
      group: THREE.Group;
      onTargetFound: () => void;
      onTargetLost: () => void;
    };
    start(): Promise<void>;

    // Add other methods and properties as needed
  }

  export default MindARThree;
}
