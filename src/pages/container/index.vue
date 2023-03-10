<template>
    <SearchOver ref="searchOverRef" :iframeVisible="searchOverVisible"/>
    <LoginDiv :iframeVisible="loginVisible"/>
    <LessComp :visible="lessCompVisible" :imgSrc="mainImgSrc" @onClose="onLessClose"/>
</template>
 
<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import SearchOver from '../searchOver/index.vue'
import LoginDiv from '../loginDiv/index.vue';
import LessComp from '@/components/LessComp.vue';
export default defineComponent({
    components: {
        SearchOver,
        LoginDiv,
        LessComp
    },
    setup(props) {
        const searchOverRef = ref()
        const searchOverVisible = ref(false)
        const loginVisible = ref(false)
        const lessCompVisible = ref(false)
        const mainImgSrc = ref('')

        const onLessClose = () => {
            console.log('on less close')
            searchOverVisible.value = true
            lessCompVisible.value = false
        }

        // @ts-ignore
        const handleMessage = async ({ type, data, option }) => {
            if(type === 'openScreenshot'){
                // userUtils.showLoginDiv({hide: true})
                // setTimeout(()=>{
                // chrome.runtime.sendMessage({ operation: 'captureVisibleTab' }, async function (res) {
                //     $('#identifyIcon').remove()
                //     $('#iframe-search').css({ display: 'block' })
                //     document.getElementById('iframe-search').contentWindow.postMessage({ type: 'screenshot', data: res, option: 'showLoginDiv' }, '*');
                //     setTimeout(()=>{
                //     document.getElementById('iframe-search').focus()
                //     }, 100)
                // });
                // }, 100)
            }
            if(type === 'screenshotCancel'){
                // $('#iframe-search').css({ display: 'none' })
                // if(option) userUtils.showLoginDiv()
            }
            if(type === 'screenshotSearch'){
                // $('#iframe-search').css({ display: 'none' })
                // getImgNewUrl(data, false)
                // if(option) userUtils.showLoginDiv()
            }
            if(type === 'getIframeENV'){
                // const {countryHttpENV} = await chrome.storage.sync.get('countryHttpENV')
                // document.getElementById('iframe-wishlist').contentWindow.postMessage({ type: 'countryHttpENV', data: countryHttpENV }, '*');
            }
            if(type === 'getWishlistIframeToken'){
                // chrome.storage.sync.get('wishlistIframeToken').then(({ wishlistIframeToken })=>{
                // document.getElementById('iframe-wishlist').contentWindow.postMessage({ type: 'postWishlistIframeToken', data: wishlistIframeToken }, '*');
                // })
            }
            if(type === 'updateCountryHttpENV'){
                // chrome.storage.sync.set({'countryHttpENV': data})
                // chrome.storage.sync.set({'wishlistIframeToken': null})
            }
        }
        // 接受iframe消息
        const initIframeListener = () => {
            window.addEventListener('message', (e) => {
                console.log('message from iframe', e.data)
                const {data} = e
                if (data.showLessClick) {
                    loginVisible.value = false
                    searchOverVisible.value = false
                    lessCompVisible.value = true
                    // console.log('data.imgsrc', data.imgSrc)
                    // foldClickHandle(data.imgSrc) // doesn't work
                }
                if(data.isCloseClicked){
                    // userUtils.showLoginDiv({hide: true})
                }
                if(data.isSearchOverCloseClicked) {
                    searchOverVisible.value = false
                }
                if(data.popWidth){
                    // $('#iframe-wishlist').width(data.popWidth)
                }
                if(data.showToastMessage) {
                    // identifyUtils.initMessage(data.message);
                }
                if (data.showLoginDiv) {
                    // userUtils.showLoginDiv()
                }
                if (data.getLookListParams) {
                    const boxes = JSON.parse(data.boxes)
                    const imgSrc = data.imgSrc
                    const params = <any>[]
                    const image = new Image();
                    image.src = imgSrc
                    image.setAttribute("crossOrigin",'Anonymous')
                    // image.onload = function () {
                    //     boxes.forEach((box: any) => {
                    //         params.push(getImgBox(this, box));
                    //     });
                    //     console.log('params>>', params)
                    //     // @ts-ignore
                    //     document.getElementById('iframe-searchOver').contentWindow.postMessage({type: 'returnLookListParams', data: {
                    //         params
                    //     }}, '*');
                    // };
                }
                if (data.getLookImgDataUrl) {
                    const {selectBox, imgSize} = data as any; // eslint-disable-line
                    const image = new Image();
                    image.src = data.imgSrc;
                    image.setAttribute("crossOrigin",'Anonymous')
                    image.onload = function () {
                        if(!selectBox) return
                        const W = selectBox.styleW.split('width:')[1].split('px')[0]
                        const H = selectBox.styleW.split('height:')[1].split('px')[0]
                        const L = Number(selectBox.styleL.split('left:')[1].split('px')[0]) - (400 - imgSize.width) / 2
                        const T = Number(selectBox.styleL.split('top:')[1].split('px')[0]) - (400 - imgSize.height) / 2
                        const canvas= document.createElement('canvas');
                        canvas.width = W;
                        canvas.height = H;
                        const bufferCanvas= document.createElement('canvas');
                        bufferCanvas.width = imgSize.width;
                        bufferCanvas.height = imgSize.height;
                        bufferCanvas.getContext('2d')?.drawImage(image, 0, 0, imgSize.width, imgSize.height);
                        canvas.getContext('2d')?.drawImage(bufferCanvas, L, T, W, H, 0, 0, W, H); //将图片绘制到canvas中
                        // @ts-ignore
                        document.getElementById('iframe-searchOver').contentWindow.postMessage({type: 'returnLookImgDataUrl', data: {
                            dataUrl: canvas.toDataURL(),
                            cropPosition: [L, T, W, H]
                        }}, '*');
                    };
                }

                if(data.wishlistIframeToken){
                    chrome.storage.sync.set({ wishlistIframeToken: data.wishlistIframeToken })
                }
                handleMessage(data)
            })
        }

        // 接受background.js和popup消息
        const messagesFromBackgroundOrPopup = async(msg: any, sender: any, sendResponse: any) => {
            console.log('message from bg or popup', msg)
            if (msg.type === 'scanClick') {
                let srcUrl = msg?.srcUrl ?? '';
                searchOverVisible.value = true;
                mainImgSrc.value = srcUrl
                searchOverRef.value.loadImage(srcUrl)
                return
            }
            
            console.log('[content.js]. Message received', msg);
        
            const response = {
                title: document.title,
                headlines: Array.from(document.getElementsByTagName<"h1">("h1")).map(h1 => h1.innerText)
            };
        
            console.log('[content.js]. Message response', response);
        
            sendResponse(response)
        }
        
        onMounted(() => {
            
            initIframeListener()
            /**
             * Fired when a message is sent from either an extension process or a content script.
             */
            chrome?.runtime?.onMessage?.addListener(messagesFromBackgroundOrPopup);
        })
        
        return {
            onLessClose,
            mainImgSrc,
            lessCompVisible,
            loginVisible,
            searchOverVisible,
            searchOverRef
        }
    }
})
</script>
 
<style lang="scss" scoped>

</style>
