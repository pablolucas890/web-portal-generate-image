<script>
export default {
    emits: ['response'],
    created() {
        this.$emit('response', name)
    },
    props: {
        title: String,
        inputType: String,
        fileType: String
    },
    data() {
        return {
            dataInput: ''
        }
    },
    watch: {
        dataInput(newdataInput) {
            if (this.inputType == 'file') {
                this.$emit('response', this.$refs.files.files[0])
            } else {
                this.$emit('response', newdataInput)
            }
        }
    }
}
</script>

<template>
    <div>
        <label class="avenir-light text-blue">{{ title }}</label>
        <input ref="files" :accept="inputType == 'file' ? fileType : ''"
            :class="inputType == 'file' ? 'custom-file-input' : ''" :type="inputType" v-model="dataInput"
            placeholder="Escreva aqui..." />
    </div>
</template>
<style>
label {
    font-size: 1.1em;
}

input {
    width: 70%;
    height: 3.5em;
    border: 1px solid #0091ea;
    background-color: white;
    font-family: avenir-light;
    color: #0091ea;
    margin-top: .25em;
    padding-left: .75em;
    box-shadow: .25em .25em #0091ea55;
}

.custom-file-input {
    color: transparent;
}

.custom-file-input::-webkit-file-upload-button {
    visibility: hidden;
}

.custom-file-input::before {
    content: 'Selecionar Arquivo ↥';
    padding-top: 1em;
    color: black;
    font-family: avenir-light;
    display: inline-block;
    background: white;
    height: 100%;
    width: 100%;
    outline: none;
    color: #0091ea;
    cursor: pointer;
}
.custom-file-input:hover::before {
    background-color: #0091ea;
    transition-duration: 300ms;
    color: white;
}
.custom-file-input:hover {
    background-color: #0091ea;
    transition-duration: 300ms;
    color: white;
}

.custom-file-input:active {
    outline: 0;
}

.custom-file-input:active::before {
    background: -webkit-linear-gradient(right, #0091ea, #ffffff);
}

@media (max-width: 766px) {
    input {
        width: 100%;
    }
}
</style>