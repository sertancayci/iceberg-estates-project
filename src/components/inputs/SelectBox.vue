<template>
    <div class="flex flex-col bg-white">
        <div class="select-container cursor-pointer flex flex-row justify-between border border-gray-400 rounded-lg p-1 px-3 pt-0 h-12"
            :class="label ? 'items-end' : 'items-center'" @click="toggleDropdown">
            <div class="w-full">
                <!-- if label has call <label else none -->

                <label v-if="label" :for="label" class="text-xs text-gray-900">{{ label }}</label>
                <div class="selected-value h-6 text-sm font-semibold" :class="{ 'is-active': dropdownOpen }">
                    <!-- {{ selectedOption[labelKey] || placeholder }} {{ selectedOption[labelSubKey] || "" }} -->
                    <div v-if="multiple">
                        <span v-for="(option, index) in selectedOptions" :key="option.id">
                            {{ option[labelKey] }} {{ option[labelSubKey] }}
                            <span v-if="index !== selectedOptions.length - 1">, </span>
                        </span>
                    </div>
                    <div v-else>
                        {{ selectedOptions[labelKey] || placeholder }} {{ selectedOptions[labelSubKey] }}
                    </div>
                </div>
            </div>
            <div>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
                    class="w-6 h-6 text-gray-600">
                    <path fill-rule="evenodd"
                        d="M12.53 16.28a.75.75 0 0 1-1.06 0l-7.5-7.5a.75.75 0 0 1 1.06-1.06L12 14.69l6.97-6.97a.75.75 0 1 1 1.06 1.06l-7.5 7.5Z"
                        clip-rule="evenodd" />
                </svg>
            </div>
        </div>

        <div v-if="dropdownOpen" class="card border options-list">
            <div v-for="option in options" :key="option.id" class="option" @click.stop="selectOption(option)">
                {{ option[labelKey] }} {{ option[labelSubKey] ? option[labelSubKey] : '' }}
            </div>
        </div>
    </div>
</template>

<script>
import { ref, computed } from 'vue';

export default {
    name: 'SelectBox',
    props: {
        multiple: Boolean,
        options: {
            type: Array,
            default: () => []  // Ensure default is an empty array
        },
        label: String,
        placeholder: String,
        modelValue: {
            type: [Array, String, Number, Object],
            default: () => [],
        },  // This value is passed down from the parent and should be handled as a prop.
        labelKey: String,
        labelSubKey: String
    },
    setup(props, { emit }) {
        const dropdownOpen = ref(false);

        const selectedOptions = computed(() => {
            if (props.multiple) {
                return props.options.filter(option => props.modelValue.includes(option.id));
            } else {
                return props.options.find(option => option.id === props.modelValue) || {};
            }
        });

        function selectOption(option) {
            if (props.multiple) {
                const newValue = [...props.modelValue];
                const index = newValue.indexOf(option.id);
                if (index === -1) {
                    newValue.push(option.id);
                } else {
                    newValue.splice(index, 1);  // Allow deselecting
                }
                emit('update:modelValue', newValue);
            } else {
                emit('update:modelValue', option.id);
            }
            dropdownOpen.value = false;  // Close dropdown on selection
            emit('handleInput');
        }

        function toggleDropdown() {
            dropdownOpen.value = !dropdownOpen.value;
        }


        return {
            dropdownOpen,
            selectedOptions,
            toggleDropdown,
            selectOption
        };
    }
};
</script>



<style scoped>
.select-container {
    position: relative;
    border: 1px solid #ccc;
    border-radius: 8px;
    cursor: pointer;
}

.selected-value {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.options-list {
    background: white;
    padding: 20px;
    border-radius: 10px;
    width: 100%;
    height: 20rem;
    max-width: 40rem;
    max-height: 50rem;
    overflow: scroll
}

.option {
    padding: 8px;
    background: #FFF;
    transition: background 0.3s;
}

.option:hover {
    background: #f0f0f0;
}
</style>
