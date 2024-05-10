<template>
  <div
    class="date-input-container bg-white flex flex-row justify-between items-end border border-gray-400 rounded-lg p-1 px-3 pt-0 h-12"
    @click="toggleDatePicker"
  >
    <div class="flex flex-col">
      <label :for="label" class="date-label text-xs text-gray-900">{{
        label
      }}</label>
      <input
        type="text"
        :ref="refName"
        :value="modelValue"
        readonly
        class="form-control h-6 text-sm font-semibold placeholder:text-black placeholder:text-sm focus:outline-none"
        placeholder="Select Date"
      />
    </div>
    <a class="input-button" title="toggle">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="w-6 h-6 text-gray-600"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"
        />
      </svg>
    </a>
  </div>
</template>

<script>
import flatpickr from "flatpickr";

export default {
  name: "DatePicker",
  props: {
    label: String,
    refName: String,
    modelValue: String,
  },
  data() {
    return {
      picker: null, // Store the flatpickr instance
    };
  },
  mounted() {
    this.initDatePicker();
  },
  methods: {
    initDatePicker() {
      if (!this.picker) {
        // Initialize flatpickr only if it hasn't been initialized yet
        this.picker = flatpickr(this.$refs[this.refName], {
          enableTime: true,
          altInput: true,
          altFormat: "F j, Y H:i",
          dateFormat: "Y-m-d H:i",
          time_24hr: true,
          onChange: this.onDateChange,
        });
      }
    },
    onDateChange(selectedDates, dateStr) {
      this.$emit("update:modelValue", dateStr);
    },
    toggleDatePicker() {
      if (this.picker) {
        this.picker.open(); // Open flatpickr
      }
    },
  },
  beforeDestroy() {
    if (this.picker) {
      this.picker.destroy(); // Cleanup flatpickr instance when component is destroyed
    }
  },
};
</script>

<style scoped>
.date-input-container {
  cursor: pointer;
}
</style>
