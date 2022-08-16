<script>
export default {
    emits: ['response'],
    created() {
        this.$emit('response', this.selected)
    },
    props: {
        title: String,
        options: Array,
    },
    data() {
        return {
            selected: ''
        }
    },
    watch: {
        selected(newSelected) {
            this.$emit('response', newSelected)
        }
    }
}
</script>

<template>
    <div>
        <label class="avenir-light text-blue">{{title}} <span class="text-danger">*</span></label>
        <br>
        <select v-model="selected">
            <option disabled value="">Selecione uma opção</option>
            <option v-for="item in options" :key="item">{{ item }}</option>
        </select>
    </div>
</template>
<style>
label {
    font-size: 1.1em;
}

select {
    width: 70%;
    height: 3.5em;
    border: 1px solid #0091ea;
    background-color: white;
    font-family: avenir-light;
    color: #0091ea;
    margin-top: .25em;
    padding-left: .75em;
    box-shadow: .25em .25em #0091ea55;
    cursor: pointer;

}

@media (max-width: 766px) {
    select {
        width: 100%;
    }
}
</style>