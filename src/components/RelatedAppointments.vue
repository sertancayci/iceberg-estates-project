<template>
    <div v-if="relatedAppointments.length > 0">
        <div class="text-[#171717] font-semibold text-sm mb-3">Related Appointments</div>
        <div class="w-full pb-2 " v-for="appointment in relatedAppointments" :key="appointment.id">
            <div class="flex flex-row border  bg-white  border-gray-500 rounded-lg  justify-between py-2 px-2">
                <div class="flex flex-col">
                    <div class="col-span-12 sm:col-span-6 lg:col-span-3 flex">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                            stroke="currentColor" class="w-6 h-6 text-gray-500">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                        </svg>

                        <p class="text-[#171717] pl-2 font-semibold">{{ appointment.appointment_address }}</p>
                    </div>
                    <div
                        class="col-span-12 sm:col-span-6 lg:col-span-3 bg-[#ec1e80] border radius-xl flex flex-row justify-between rounded-2xl p-1  w-[23rem]">
                        <div class="flex ml-1 px-3 py-2 rounded-2xl bg-white w-[10rem] "
                            :class="{ 'justify-between': appointmentStatus(appointment).statusText === 'Upcoming', 'justify-center': appointmentStatus(appointment).statusText !== 'Upcoming' }">
                            <span class="text-center font-semibold text-sm"
                                :class="`${appointmentStatus(appointment).color}`">
                                {{ appointmentStatus(appointment).statusText }}

                            </span>
                            <span class="text-[#727272] font-semibold text-sm text-center">
                                {{ appointmentStatus(appointment).timeLeft }}
                            </span>
                        </div>
                        <p class="text-white font-semibold place-self-center pr-6"> {{
                            formatDate(appointment.appointment_date) }}
                        </p>
                    </div>
                </div>
                <div class="justify-center items-end flex ">
                    <AgentsTag :agents="appointmentAgentDetails" :displayCount="4" />
                </div>
            </div>
        </div>
    </div>
</template>


<script>
import AirtableService from '../api/AirtableService';
import AgentsTag from './AgentsTag.vue';

export default {
    props: {
        contactId: String,
        currentAppointmentId: String
    },
    components: {
        AgentsTag
    },
    data() {
        return {
            relatedAppointments: [],
            appointmentAgentDetails: []
        };
    },
    created() {
        this.fetchRelatedAppointments(this.contactId,this.currentAppointmentId);
    },
    methods: {
        appointmentStatus(appointment) {
            if (!appointment) return { statusText: 'Unknown', timeLeft: '', color: 'text-gray-500' };

            const now = new Date();
            const appointmentDate = new Date(appointment.appointment_date);


            if (appointment.is_cancelled) {
                return { statusText: 'Cancelled', timeLeft: '', color: 'text-red-500' };
            } else if (appointmentDate < now) {
                return { statusText: 'Completed', timeLeft: '', color: 'text-green-500' };
            } else {
                const timeLeft = this.calculateTimeLeft(appointmentDate, now);
                return { statusText: 'Upcoming', timeLeft, color: 'text-yellow-500' };
            }
        },
        formatDate(date) {
            const dateObj = new Date(date);
            const formattedDate = dateObj.toLocaleDateString('en-GB', {
                year: 'numeric', month: '2-digit', day: '2-digit'
            });
            const formattedTime = dateObj.toLocaleTimeString('en-GB', {
                hour: '2-digit', minute: '2-digit', hour12: false
            });
            return `${formattedDate} ${formattedTime}`;
        },
        calculateTimeLeft(appointmentDate, now) {
            const diff = appointmentDate - now;
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);

            if (days > 0) {
                return `${days} day${days > 1 ? 's' : ''}`;
            } else {
                return `${hours} hour${hours !== 1 ? 's' : ''}`;
            }
        },
        async fetchRelatedAppointments(contactId,currentAppointmentId) {
            if (this.contactId) {
                const contacts = await AirtableService.getContactIdById(contactId);
                if (contacts.length > 0) {
                    const contactId = contacts[0].contact_id;
                     const relatedAppointmentsFetch = await AirtableService.getRelatedAppointmentsByContactId(contactId);
              
                    this.relatedAppointments = relatedAppointmentsFetch.filter(appointment => {
                        return appointment.id !== currentAppointmentId;  // Exclude the current appointment
                    }).map(appointment => {
                        return {
                            ...appointment,
                            appointment_date: appointment.appointment_date || 'No date provided'
                        };
                    });

                    const appointmentAgentIds = this.relatedAppointments.map(appointment => appointment.agent_id);
                    this.fetchAgentDetails(appointmentAgentIds);

                } else {
                    console.log('No contacts found with the id:', this.contactId);
                }
            }
        },
        async fetchAgentDetails(appointmentAgentIds) {
            const agentIds = appointmentAgentIds;
            this.appointmentAgentDetails = await AirtableService.getAgentsDetails(agentIds);
        },
    }
};
</script>
