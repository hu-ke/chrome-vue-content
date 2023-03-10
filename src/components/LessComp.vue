<template>
  <div class="mask3" v-if="visible">
    <div>
      <img :src="imgSrc" />
    </div>
    <div>
      <p>See all the products you search</p>
      <p class="text-sub">There are lower prices here!</p>
    </div>
    <div class="right-folder-button">
      View More
    </div>
    <div class="close-fold-img">
      <img src="@/assets/close.png" alt="close" @click="$emit('onClose')"/>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'LessComp',
  props: {
    visible: Boolean,
    imgSrc: String,
  },
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

.mask3{
  text-align: initial;
  position: fixed;
  background: #F8FAFC;
  top: 32px;
  left: 32px;
  border-radius: 40px;
  height: 80px;
  width: 418px;
  opacity: 1;
  z-index: 999999999;
  display: flex;
  justify-content: space-around;
  align-items: center;
  box-sizing: content-box;
  cursor: pointer;
}
.mask3 img{
  width: 64px;
  height: 64px;
  border-radius: 50%;
}
.mask3 p{
  margin: 0;
}
.mask3 .text-sub{
  font-size: 12px;
  color: #64748B;
}
.mask3 .right-folder-button{
  display: flex;
  background: #1E293B;
  color:#fff;
  font-size: 14px;
  height: 64px;
  width: 64px;
  border-radius: 50%;
  align-items: center;
  text-align: center;
}
.mask3 .close-fold-img{
  position: absolute;
  background: #fff;
  width: 24px;
  height: 24px;
  top: 0;
  right: -20px;
  border-radius: 50%;
}
.mask3 .close-fold-img img{
  width: 10px;
  height: 10px;
  margin-left: 7px;
}
</style>
