<template>
  <Page>
    <ActionBar>
      <Label text="Home" />
    </ActionBar>
<ScrollView>
      <GridLayout rows="*,auto,auto,auto,auto,auto,auto,auto,auto,auto,auto" height="100%">
       <MLKitView pause="true" height="100%" rowSpan="3"  @loaded="onLoaded" cameraPosition="back" :detectionType="detectorType" @detection="onDetection"/>
       <Button row="1" height="40" text="Toggle Camera" @tap="toggleCamera" />
       <Label color="red" row="2" :text="'TorchOn ' + torchOn"/>
       <Button row="3" height="40" text="Toggle Torch" @tap="toggleTorch" />
       <Button row="4" height="40" text="Request Camera Permission" @tap="requestPermission" />
       <Label row="5" :text="'Detecting ' + detectorType"/>
       <Button row="6" height="40" text="Change Detector Type" @tap="changeType" />
       <Label row="7" :text="'isPaused : ' + isPaused"/>
       <Button row="8" height="40" text="Toggle Pause" @tap="togglePause" />
       <Button row="9" height="40" text="Process Still imAGE" @tap="processStill" />
       
    </GridLayout>
</ScrollView>
  
  </Page>
</template>

<script lang="ts">
  import { Dialogs, EventData, ImageSource} from "@nativescript/core";
import Vue from "nativescript-vue";
import  { DetectionEvent, DetectionType, detectWithStillImage, MLKitView, } from "@nativescript/mlkit-core"
import {BarcodeResult} from "@nativescript/mlkit-barcode-scanning"
  export default Vue.extend({
    data(){
      return{
   camera: new MLKitView(),
  detectorType :DetectionType.Barcode,
  isPaused :false,
  torchOn : false,
      }
    },
    methods:{
   
    onLoaded(args:any) {
         console.log(args.eventName)
    this.camera = args.object as MLKitView;
    this.isPaused= this.camera.pause;
	this.torchOn = this.camera.torchOn;
  },

  onDetection(event: DetectionEvent) {
    console.log('onDetection', event.data, event.type);
    if (event.type === DetectionType.Barcode) {
      const first = event.data as BarcodeResult;
      console.log('bounds', first.bounds);
    }
  },

  toggleCamera() {
    this.camera.toggleCamera();
  },

  toggleTorch() {
    this.camera.torchOn = !this.camera.torchOn
	this.torchOn = this.camera.torchOn;
  },

  requestPermission() {
    this.camera.requestCameraPermission();
  },

  changeType() {
    Dialogs.action('Change Detector Type', 'Cancel', ['all', 'barcode', 'digitalInk (unsupport atm)', 'face', 'image', 'object', 'pose', 'text', 'none']).then((value) => {
      if (value === 'Cancel') {
        return;
      }
      if (value.indexOf('digitalInk') > -1) {
        Dialogs.alert('digitalInk is currently unsupported');
        this.detectorType= DetectionType.None
      } else {
        this.detectorType= value as DetectionType;
      }
    });
  },

  togglePause(args:EventData) {
    this.camera.pause = !this.camera.pause;
    this.isPaused = this.camera.pause;
  },

  async processStill(args: EventData) {
    try {
      const src = await ImageSource.fromUrl('https://www.jqueryscript.net/images/jQuery-Plugin-To-Generate-International-Article-Number-Barcode-EAN13.jpg');

      console.log(src.android);
      const result = await detectWithStillImage(src, {
        detectorType: DetectionType.Barcode,
      });
      console.log('processStill', result.barcode[0]);
    } catch (e) {
      console.log(e);
    }
  }
    },
 
  });
</script>

<style scoped lang="scss">
@import "@nativescript/theme/scss/variables/blue";

// Custom styles
.fas {
  @include colorize($color: accent);
}

.info {
  font-size: 20;
  horizontal-align: center;
  vertical-align: center;
}
</style>
