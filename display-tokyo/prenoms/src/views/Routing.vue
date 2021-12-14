<template>
  <div :class="$style.parent">
    <div :class="$style.child">
      <h1>Routing Test Page</h1>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RoutingController'
}
</script>
<style module>
.parent {
  margin-top: 50px;
  height: 500px;
  width: 100%;
  /* 子要素を中央に配置する */
  display: flex;
  justify-content: center;
  align-items: center;
}

.child {
  overflow: hidden;
  height: 100%;
  width: 100%;
  /* 子要素を中央に配置する */
  display: flex;
  justify-content: center;
  align-items: center;
}

.item {
  width: 150px;
}

.value {
  width: 400px;
}
</style>
