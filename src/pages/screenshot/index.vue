<template>
    <iframe 
        v-if="visible"
        id="iframe-screenshot"
        height="100%" 
        width="100%" 
        style="position: fixed;left: 0;z-index: 9999999999;top: 0;" 
        :src="`${url}/plugin/screenshot`"
        title="search"
    >
    </iframe>
</template>
 
<script lang="ts">
import { defineComponent, ref } from 'vue';
export default defineComponent({
    props: {
        visible: Boolean
    },
    components: {
    },
    setup(props) {
        const url = ref('http://localhost:5173')
        return {
            url
        }
    }
})
</script>
 
<style lang="scss" scoped>

</style>
