<template>
    <iframe 
        v-show="iframeVisible"
        id="iframe-searchOver"
        height="100%" 
        width="100%" 
        style="position: fixed;left: 0;z-index: 2147483645; top: 0"
        title="search"
        :src="`${url}/plugin/search`"
    >
    </iframe>
</template>
 
<script lang="ts">
import { getImgBox } from '../../utils/imgUtil';
import { defineComponent, onMounted, ref } from 'vue';
import { FetchGraphql, getIframeUrl } from '../../utils/http';
import { getUrlFormData, imgUrlToFile } from "../../utils/index";
export default defineComponent({
    components: {
    },
    setup(props) {
        const iframeVisible = ref(false)
        const url = ref('http://localhost:5173')

        const fetchImgNewUrl = async(url: string, flag: boolean) => {
            const res = await FetchGraphql(`
                query uploadImg4GoogleWishList {
                    uploadImg4GoogleWishList(url: "${url}"){
                        status
                        url
                        newUrl
                    }
                }
                `, null)
                return {
                newUrl: `https://${res?.data?.uploadImg4GoogleWishList?.newUrl}`,
                status: res?.data?.uploadImg4GoogleWishList?.status,
            //   tabId: tabId,
            }
        }

        const fetchUploadTokens = async() => {
            const res = await FetchGraphql(`
                query fetchImgSearchAuthToken {
                    stsUploadTmpFile:fetchImgSearchAuthToken {
                    stsAccessKeyId
                    stsAccessKeySecret
                    bucket
                    encodedPolicy
                    endpoint
                    objectKey
                    signature
                    useAccelerate
                    regionId
                    picUrl
                    }
                }
            `, 
            null)
            return res
        }

        const FetchPostForm = async (url: string, formData: any): Promise<any> => {
            try {
            let response = await fetch(url, {
                method: 'post',
                mode: 'no-cors',
                body: formData,
            })
            return {
                status: response.status,
                data: null,
                ok: response.ok,
            }
            } catch (e: any) {
            //   message({ message: e.message })
            console.error(e.message)
            }
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
                console.log('onmessage', e.data)
                const {data} = e
                if (data.showLessClick) {
                    // console.log('data.imgsrc', data.imgSrc)
                    // foldClickHandle(data.imgSrc) // doesn't work
                }
                if(data.isCloseClicked){
                    // userUtils.showLoginDiv({hide: true})
                }
                if(data.isSearchOverCloseClicked) {
                    iframeVisible.value = false
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
                    image.onload = function () {
                        // boxes.forEach((box: any) => {
                        //     params.push(getImgBox(this, box));
                        // });
                        // console.log('params>>', params)
                        // // @ts-ignore
                        // document.getElementById('iframe-searchOver').contentWindow.postMessage({type: 'returnLookListParams', data: {
                        //     params
                        // }}, '*');
                    };
                }
                if (data.getLookImgDataUrl) {
                    const {selectBox, imgSize} = data
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
            if (msg.type === 'scanClick') {
                let srcUrl = msg?.srcUrl ?? '';
                // 1.先拿到非跨域图片url
                const msgToSend = await fetchImgNewUrl(srcUrl, true);
                iframeVisible.value = true
                console.log('msgToSend', msgToSend)
                if (msgToSend.status) {
                    // 2.图片url转为file
                    const file = await imgUrlToFile(msgToSend.newUrl)

                    console.log('2.图片url转为file', file)
                    const res = await fetchUploadTokens()

                    console.log('3.获取oss上传所需要的token配置', res)
                    const {host, formData, filePath, filename, ossUrl} = getUrlFormData(res, srcUrl, file)
                    //4.然后上传到oss, 获得新的oss url地址
                    await FetchPostForm(host, formData)
                    console.log('4.然后上传到oss, 获得新的oss url地址')
                    const image = new Image();
                    image.src = srcUrl;
                    console.log('src>>', srcUrl)
                    image.setAttribute("crossOrigin",'Anonymous')
                    image.onload = async () => {
                        let res = await getIframeUrl() || ''
                        // @ts-ignore
                        document.getElementById('iframe-searchOver').contentWindow.postMessage({type: 'searchOver', data: {
                            ...msgToSend,
                            ossUrl,
                            isUSA: res && res.indexOf('us-www') > 0,
                            image: {
                                height: image.height,
                                width: image.width,
                                src: srcUrl
                            }
                        }}, '*');
                    };
                }
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
            url,
            iframeVisible
        }
    }
})
</script>
 
<style lang="scss" scoped>

</style>
