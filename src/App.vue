<script>
import Container from './components/Container.vue'
import Input from './components/Input.vue';
import Select from './components/Select.vue';

export default {
  components: {
    Container,
    Input,
    Select
  },
  data() {
    return {
      isSendForm:false,
      preenchido: false,
      boards: ['RaspberryPI', 'OrangePI'],
      selectedBoard: '',
      versions: ['1-2-33', '4-5-33'],
      selectedVersion: '',
      imageName: '',
      db3File: null,
      ovpnFile: null,
      Appdb3File: null
    }
  },
  methods: {
    todosPreenchidos() {
      if (this.selectedBoard === '' || this.selectedVersion === '' || this.imageName === '') {
        this.preenchido = false;
      } else {
        if (this.db3File === null || this.ovpnFile === null) {
          this.preenchido = false;
        } else {
          if (this.db3File.name === undefined || this.ovpnFile.name === undefined) {
            this.preenchido = false
          } else {
            this.preenchido = true
          }
        }
      }
    },
    generateImage() {
      alert('Valores Selecionados:\n\n' + this.selectedBoard + '\n' + this.imageName + '\n' + this.selectedVersion + '\n' + this.db3File.name + '\n' + this.ovpnFile.name + '\n' + this.Appdb3File.name)
    },
  },
  watch: {
    selectedBoard() {
      this.todosPreenchidos()
    },
    selectedVersion() {
      this.todosPreenchidos()
    },
    imageName() {
      this.todosPreenchidos()
    },
    db3File() {
      this.todosPreenchidos()
    },
    ovpnFile() {
      this.todosPreenchidos()
    }
  },
}
</script>

<template>
  <Container class="global-container">
    <Container class="first-container">
      <div class="row mb-md-3">
        <div class="col-12 col-md-7">
          <h2 class="title text-blue barlow-medium">Sistema de Geração de Imagem</h2>
        </div>
        <div class="col-0 col-md-2"></div>
        <div class="col-12 col-md-3 text-center">
          <img src="./assets/logo.png" width="200" class="float-right" alt="Controllar">
        </div>
      </div>
      <div class="row">
        <div class="col-md-4">
          <Select title="Selecione uma Placa: " name="Boards" :options="boards"
            @response="(selectedItem) => selectedBoard = selectedItem"></Select>
        </div>
        <div class="col-md-4">
          <Select title="Selecione uma Versão: " name="Versions" :options="versions"
            @response="(selectedItem) => selectedVersion = selectedItem"></Select>
        </div>
        <div class="col-md-4">
          <Input title="Nome da Imagem: " inputType="text"
            @response="(imageNameChild) => imageName = imageNameChild"></Input>
        </div>
      </div>
      <Container class="mt-4 mb-4 p-4 second-containder">
        <h5 class="barlow-medium mb-3">Arquivos de usuário:</h5>
        <div class="row">
          <div class="col-md-4">
            <Input title="Arquivo .db3: " fileType=".db3" inputType="file" @response="(db3) => db3File = db3"></Input>
            <span class="selected-text ">{{ db3File === null ? '' : (db3File.name === undefined ? '' : `Selecionado:
                          ${db3File.name}`)
            }}</span>
          </div>
          <div class="col-md-4">
            <Input title="Arquivo .ovpn:" fileType=".ovpn" inputType="file"
              @response="(ovpn) => ovpnFile = ovpn"></Input>
            <span class="selected-text ">{{ ovpnFile === null ? '' : (ovpnFile.name === undefined ? '' : `Selecionado:
                          ${ovpnFile.name}`)
            }}</span>
          </div>
          <div class="col-md-4">
            <Input title="Arquivo App.deb3 (Opcional):" fileType=".db3" inputType="file"
              @response="(appdb3) => Appdb3File = appdb3"></Input>
            <span class="selected-text ">{{ Appdb3File === null ? '' : (Appdb3File.name === undefined ? '' :
                `Selecionado: ${Appdb3File.name}`)
            }}</span>
          </div>
        </div>
      </Container>
      <div>
        <button @click="generateImage" :disabled="!preenchido">Gerar Imagem</button>
        <span :class="preenchido ? 'invisible' : 'visible'">
          Preencha todos os campos *
        </span>
      </div>
    </Container>
  </Container>
</template>
<style>
.first-container {
  padding: 2em;
}

.global-container {
  padding: 1em;
  box-shadow: inset 0 1em 2em #e9e9e9;
}

.invisible {
  visibility: true;
}

.visible {
  visibility: false;
  font-family: barlow-medium;
  color: red;
  font-size: .8em;
  margin-left: 1em;
}

.title {
  font-size: 2.25em;
}

.selected-text {
  font-family: barlow-medium;
  font-size: .9em;
}

.second-containder {
  box-shadow: inset .25em .25em 1em #e9e9e9;
}

h5 {
  font-size: 1.3em;
}

button {
  background-color: #0091ea;
  height: 2.5em;
  width: 12em;
  border: 0px;
  color: black;
  font-family: barlow-medium;
  font-size: 1.25em;
  box-shadow: .25em .25em #0091ea55;
}

button:hover {
  background-color: #E8F2FF;
  transition-duration: 300ms;
}
</style>