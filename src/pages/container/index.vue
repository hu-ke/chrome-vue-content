<template>
    <SearchOver ref="searchOverRef" :iframeVisible="searchOverVisible"/>
    <LoginDiv :iframeVisible="loginVisible" :iframeWishlistWidth="iframeWishlistWidth"/>
    <Screenshot :visible="screenshotVisible"/>
    <LessComp :visible="lessCompVisible" :imgSrc="mainImgSrc" @onClose="onLessClose" @onViewMore="onViewMore"/>
</template>
 
<script lang="ts">
import { getImgBox } from '../../utils/imgUtil';
import { initMessage } from '@/utils/index';
import { defineComponent, onMounted, ref } from 'vue';
import SearchOver from '@/pages/searchOver/index.vue'
import LoginDiv from '@/pages/loginDiv/index.vue';
import Screenshot from '@/pages/screenshot/index.vue';
import LessComp from '@/components/LessComp.vue';
export default defineComponent({
    components: {
        SearchOver,
        LoginDiv,
        LessComp,
        Screenshot
    },
    setup(props) {
        const searchOverRef = ref()
        const searchOverVisible = ref(false)
        const loginVisible = ref(false)
        const screenshotVisible = ref(false)
        const lessCompVisible = ref(false)
        const mainImgSrc = ref('')
        const iframeWishlistWidth = ref(0)

        const onViewMore = () => {
            searchOverVisible.value = true
            onLessClose();
        }

        const onLessClose = () => {
            lessCompVisible.value = false
        }

        // @ts-ignore
        const handleIframeMessage = async ({ type, data, option }) => {
            if(type === 'openScreenshot'){
                loginVisible.value = false
                screenshotVisible.value = true
                setTimeout(()=>{
                    chrome.runtime.sendMessage({ operation: 'captureVisibleTab' }, async function (res) {
                        // $('#identifyIcon').remove()
                        //@ts-ignore
                        document.getElementById('iframe-screenshot').contentWindow.postMessage({ type: 'screenshot', data: res, option: 'showLoginDiv' }, '*');
                        setTimeout(()=>{
                            //@ts-ignore
                            document.getElementById('iframe-screenshot').focus()
                        }, 100)
                    });
                }, 100)
            }
            if(type === 'screenshotCancel'){
                screenshotVisible.value = false
            }
            if(type === 'screenshotSearch'){
                screenshotVisible.value = false
                searchOverVisible.value = true
                try {
                searchOverRef.value.loadImage(data, {needNewUrl: false})
                } catch (e) {
                    console.log('err', e)
                }
            }
            if(type === 'getIframeENV'){
                // const {countryHttpENV} = await chrome.storage.sync.get('countryHttpENV')
                // document.getElementById('iframe-wishlist').contentWindow.postMessage({ type: 'countryHttpENV', data: countryHttpENV }, '*');
            }
            if(type === 'getWishlistIframeToken'){
                chrome?.storage.sync.get('wishlistIframeToken').then(({ wishlistIframeToken })=>{
                    console.log('wishlistIframeToken', wishlistIframeToken)
                    // @ts-ignore
                    document.getElementById('iframe-wishlist')?.contentWindow.postMessage({ type: 'postWishlistIframeToken', data: wishlistIframeToken }, '*');
                })
            }
            if(type === 'updateCountryHttpENV'){
                // chrome.storage.sync.set({'countryHttpENV': data})
                // chrome.storage.sync.set({'wishlistIframeToken': null})
            }
        }
        // 接受iframe消息
        const initIframeListener = () => {
            window.addEventListener('message', (e) => {
                console.log('[content.js]. message from iframe', e.data)
                const {data} = e
                if (data.refreshWishList) {
                    console.log('data.refreshWishList', data)
                    // @ts-ignore
                    document.getElementById('iframe-wishlist')?.contentWindow.postMessage({type: 'updateWishList'}, '*');
                }
                if (data.showLessClick) {
                    loginVisible.value = false
                    searchOverVisible.value = false
                    lessCompVisible.value = true
                }
                if(data.isCloseClicked){
                    loginVisible.value = false
                }
                if(data.isSearchOverCloseClicked) {
                    searchOverVisible.value = false
                }
                if(data.popWidth){
                    iframeWishlistWidth.value = data.popWidth
                }
                if(data.showToastMessage) {
                    console.log('data.message', data.message)
                    initMessage(data.message)
                }
                if (data.showLoginDiv) {
                    loginVisible.value = true
                }
                if (data.getLookListParams) {
                    const boxes = JSON.parse(data.boxes)
                    const imgSrc = data.imgSrc
                    const params = <any>[]
                    const image = new Image();
                    image.src = imgSrc
                    image.setAttribute("crossOrigin",'Anonymous')
                    image.onload = function () {
                        boxes.forEach((box: any) => {
                            params.push(getImgBox(this, box));
                        });
                        // @ts-ignore
                        document.getElementById('iframe-searchOver').contentWindow.postMessage({type: 'returnLookListParams', data: {
                            params
                        }}, '*');
                    };
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
                    // 用户从ifram登陆完成后，会发wishlistIframeToken给content                    
                    chrome.storage.sync.set({ wishlistIframeToken: data.wishlistIframeToken })
                }
                handleIframeMessage(data)
            })
        }

        // 接受background.js和popup消息
        const messagesFromBackgroundOrPopup = async(msg: any, sender: any, sendResponse: any) => {
            console.log('[content.js]. message from bg or popup', msg)
            if (msg.type === 'scanClick') {
                let srcUrl = msg?.srcUrl ?? '';
                searchOverVisible.value = true;
                mainImgSrc.value = srcUrl
                searchOverRef.value.loadImage(srcUrl, {needNewUrl: true})
            } else if (msg.type === 'SHOW_LOGIN_DIV') {
                loginVisible.value = true
            }
            // 防止控制台报错：message port closed before a response was received
            sendResponse({
                status: 'ok'
            })
        }
        
        onMounted(() => {
            
            initIframeListener()
            /**
             * Fired when a message is sent from either an extension process or a content script.
             */
            chrome?.runtime?.onMessage?.addListener(messagesFromBackgroundOrPopup);
        })
        
        return {
            iframeWishlistWidth,
            onViewMore,
            onLessClose,
            mainImgSrc,
            lessCompVisible,
            loginVisible,
            searchOverVisible,
            screenshotVisible,
            searchOverRef
        }
    }
})
</script>
 
<style lang="scss" scoped>

</style>
