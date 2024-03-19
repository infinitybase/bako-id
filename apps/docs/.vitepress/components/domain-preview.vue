<template>
  <div class="container">
    <div class="wrapper handler">
      <img src="https://pixel-icon-gugaba29.vercel.app/?name=bako_icon" alt="Icon">
      @fuel_network
    </div>
    <div class="wrapper">
      ▶
    </div>
    <div class="wrapper handler">
      0x24be37f...7d1b7008
    </div>
  </div>
</template>

<style scoped>
  .container {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 16px 16px 0;
    gap: 16px;
  }

  .container .wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8px;
  }

  .container .wrapper.handler {
    border-radius: 8px;
    border: 1px solid #ffc01026;
    padding: 12px;
    color: var(--vp-c-brand-2);
    font-weight: 500;
  }

  .container .wrapper.address {
    max-width: 200px;
    color: var(--vp-c-brand-1);
  }

  .container img {
    max-width: 30px;
    border-radius: 5px;
  }
</style>
