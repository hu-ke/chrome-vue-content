<template>
    <div id="maskDrag" class="ui-widget-content" v-if="iframeVisible" @mousedown="move">
        <div style="position: relative;">
            <!-- 因为iframe把maskDrag盖住了，所以拖拽在header-circle上才有效 -->
            <div class="header-circle"></div>
            <!-- <iframe id="iframe-wishlist" height="720" width="375" title="three part login"></iframe> -->
            <iframe style="border: none;" id="iframe-wishlist" height="720" :width="iframeWishlistWidth || 375" src="http://localhost:5173/plugin/home" title="three part login"></iframe>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, toRefs } from "vue";

export default defineComponent({
    name: 'loginDiv',
    props: {
      iframeVisible: Boolean,
      iframeWishlistWidth: Number,
    },
    components: {
    },
    setup(props, {emit}) {
        const data = reactive({

        })

        const move = (e: MouseEvent) => {
          const maskDragEle = document.getElementById('maskDrag') as any
          let disX = e.clientX - maskDragEle?.offsetLeft
          let disY = e.clientY - maskDragEle?.offsetTop
          console.log('disX', disX, 'disY', disY)
          document.onmousemove = (e)=>{       //鼠标按下并移动的事件
                //用鼠标的位置减去鼠标相对元素的位置，得到元素的位置
                let left = e.clientX - disX;    
                let top = e.clientY - disY;
                
                //绑定元素位置到positionX和positionY上面
                // this.positionX = top;
                // this.positionY = left;
                
                //移动当前元素
                maskDragEle.style.left = left + 'px';
                maskDragEle.style.top = top + 'px';
            };
            document.onmouseup = (e) => {
                document.onmousemove = null;
                document.onmouseup = null;
            };
        }
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
          move,
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
  // 不要高亮元素
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  -o-user-select: none;
  user-select: none;
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
  background-image: url('../../assets/drag-icon.png');
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