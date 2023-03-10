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
import { defineComponent, ref } from 'vue';
import { FetchGraphql, getIframeUrl } from '../../utils/http';
import { getUrlFormData, imgUrlToFile } from "../../utils/index";
export default defineComponent({
    props: {
        iframeVisible: {
            type: Boolean,
            default: () => {
                return false
            }
        }
    },
    components: {
    },
    setup(props) {
        const url = ref('http://localhost:5173')

        const loadImage = async(srcUrl: string) => {
            // 1.先拿到非跨域图片url
            const msgToSend = await fetchImgNewUrl(srcUrl, true);
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
        }
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
        
        return {
            loadImage,
            url,
        }
    }
})
</script>
 
<style lang="scss" scoped>

</style>
