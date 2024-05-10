<template>
    <button
      :class="btnClass"
      @click="onClick"
      :type="type"
    >
      {{ text }}
    </button>
  </template>
  
  <script>
  export default {
    name: 'DynamicButton',
    props: {
      text: {
        type: String,
        default: 'Button'
      },
      type: {
        type: String,
        default: 'button' // or 'submit', 'reset', etc.
      },
      btnClass: {
        type: String,
        default: 'btn' // Default CSS class
      },
      action: Function
    },
    methods: {
      onClick() {
        if (this.action) {
          this.action();
        }
      }
    }
  }
  </script>
  
  <style scoped>
  .btn {
    padding: 0.5rem 1rem;
    border: 1px solid transparent;
    border-radius: 0.25rem;
    color: white;
    background-color: #007BFF;
    cursor: pointer;
  }
  
  .btn:hover {
    background-color: #0056b3;
  }
  </style>
  