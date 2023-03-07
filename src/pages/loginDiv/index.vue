<template>
    <div id="maskDrag" class="ui-widget-content">
        <div style="position: relative;">
            <!-- <div class="header-circle"></div> -->
            <img :src="require('../../assets/images/drag-icon.png')" alt="">
            <!-- <iframe id="iframe-wishlist" height="720" width="375" title="three part login"></iframe> -->
            <iframe style="border: none;" id="iframe-wishlist" height="720" width="375" src="http://localhost:5173/plugin/home" title="three part login"></iframe>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, toRefs } from "vue";

export default defineComponent({
    name: 'loginDiv',
    components: {
    },
    setup(props, {emit}) {
        const data = reactive({

        })
        onMounted(async() => {
            // await chrome.runtime.sendMessage({ operation: 'getEnv' }, async function (res) {
            //     let url = res ? `${res}/plugin/wishlist` : 'https://getguang.com/plugin/wishlist'
            //     if($('#maskDrag').length===0){
            //     $('body').append(entHTML(url));
            //     $("#maskDrag").draggable({
            //         drag: function( event, ui ) {
            //         ui.position.top = Math.max( 0, ui.position.top );
            //         }
            //     })
            //     $('.close-drag').unbind().click(function () {
            //         $('#maskDrag').remove()
            //     })
            //     }
            //     if (options && options.hide) {
            //         $("#maskDrag").hide()
            //     } else {
            //         $("#maskDrag").show()
            //     }
            // });
        })
        return {
            ...toRefs(data)
        }
    }
})
</script>

<style lang='scss'>
#maskDrag{
  z-index: 2147483646;
  position: fixed;
  top: 30px;
  left:calc(100% - 405px);
  /* height: 780px; */
  background: transparent;
  cursor: pointer;
  animation:0.3s ease-in fadeInRight;
  animation-fill-mode: both;
  border-radius: 32px;
  // @ts-ignore
  box-shadow: 0 4px 7px RGB(30 41 59 / 20%);
}

.close-drag {
  position: absolute;
  right: 0;
  top: 0;
  cursor: pointer;
}

#maskDrag .header-circle {
  position:absolute;
  cursor: pointer;
  top: 26px;
  width: 24px;
  height: 24px;
  background-size: 18px 18px;
  background-repeat: no-repeat;
  background-position: center;
  left: 293px;
  // background-image: url('../../assets/images/drag-icon.png');
}

@keyframes fadeInRight {
  0% {
     opacity: 0;
     transform: translateX(20px);
  }
  100% {
     opacity: 1;
     transform: translateX(0);
  }
}

</style>