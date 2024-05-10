<template>

    <div v-for="(agent, index) in visibleAgents" :key="agent.id" @click="selectable && toggleSelection(agent)"
        class="bg-white p-[5px] rounded-[50%]  ml-[-10px] z-10 hover:z-50 group"
        :class="[{ 'z-50 border-gray-600 border-2': isSelected(agent)}]">
        <div class="w-10 h-10 text-xs font-bold z-0 tooltip group rounded-[50%] text-white relative cursor-pointer flex justify-center items-center"
            :style="tagStyle(agent.color)">
            {{ getInitials(agent) }}
            <span class="hidden group-hover:flex tooltiptext">{{ agent.agent_name + ' ' + agent.agent_surname }}</span>
        </div>

    </div>
    <!-- Display +count if there are more agents than displayed -->
    <div v-if="agents.length > displayCount" class="cursor-pointer bg-white p-[5px] rounded-[50%]  ml-[-10px] z-10 "
        @click="toggleAgentVisibility">
        <div class="w-10 h-10 flex justify-center items-center rounded-full bg-gray-200 text-black">
            {{ allAgentsVisible ? '>' : '+' + (agents.length - displayCount) }}
        </div>
    </div>

</template>

<script>

export default {
    name: 'AgentsTag',
    props: {
        agents: Array,
        selectable: Boolean,
        displayCount: {
            type: Number,
            default: 5
        }
    },
    emits: ['agentSelected'], 
    data() {
        return {
            selectedAgents: [],
            allAgentsVisible: false
        };
    },
    computed: {
        visibleAgents() {
            return this.allAgentsVisible ? this.agents : this.agents.slice(0, this.displayCount);
        }
    },
    methods: {
        tagStyle(color) {
            return {
                backgroundColor: color,
                cursor: this.selectable ? 'pointer' : 'default',
            };
        },

        toggleSelection(agent) {
            const index = this.selectedAgents.indexOf(agent.id);
            if (index === -1) {
                this.selectedAgents.push(agent.id);
            } else {
                this.selectedAgents.splice(index, 1);
            }
            this.$emit('agent-selected', agent.number);
        },

        isSelected(agent) {
            return this.selectedAgents.includes(agent.id);
        },
        getInitials(agent) {
            return `${agent.agent_name[0]}${agent.agent_surname[0]}`;
        },
        toggleAgentVisibility() {
            this.allAgentsVisible = !this.allAgentsVisible;
        }
    },
};
</script>
<style scoped>
/* Tooltip text */
.tooltip .tooltiptext {
    visibility: hidden;
    background-color: #fffbfb;
    color: #837a7a;
    text-align: center;
    padding: 8px;
    border-radius: 6px;
    position: absolute;
    z-index: 1;
    margin-bottom: 3rem;
    margin-left: 3rem;

    /* Position the tooltip text - see examples below! */
    position: absolute;
    z-index: 1;
}

.tooltip:hover .tooltiptext {
    visibility: visible;
}
</style>