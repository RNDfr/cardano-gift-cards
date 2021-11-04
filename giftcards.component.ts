import { Component, OnInit } from '@angular/core';
import * as bip39 from 'bip39';
import * as CSL from '@emurgo/cardano-serialization-lib-asmjs';

import * as stringEn from '../strings.json'
import * as stringFr from '../strings_fr.json'


const joinMnemonicWords = (mnenomic: string[]) => mnenomic.join(' ');
const generateMnemonicWords = (strength = 256) => bip39.generateMnemonic(strength).split(' ');
const harden = (num: number): number => 0x80_00_00_00 + num;

@Component({
  selector: 'app-giftcards',
  templateUrl: './giftcards.component.html',
  styleUrls: ['./giftcards.component.scss']
})
export class GiftcardsComponent implements OnInit {

  eulaLink = "/en/eula"
  address = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
  words="xxxx xxxxx xxx xxxx xxxx xxxxxx xxxx xxxx xxxx xxxxx xxx xxxxxx xxxx xxxxxx xxxxx xxxxx xxxx xxxx xxx xxxxx xxxx xxxxxx xxxx xxxxx"
  loading = false;
  date;
  cardTitle = "CARDANO GIFT CARD"
  cardAmount = "5.00";
  cardColor ="#ffffff";
  isolatePassword = false;
  agreeTerms = false;
  createWallet: boolean = false;
  password = "GFTXXXX";
  cardstyleTemplate = "background: url('/assets/img/<img>') center / 500px;"
  cardstyle = " "
  selectedimg = 0
  imgs = ['gifts.webp','car.webp', 'dices.webp', 'wave.webp', 'jewel.webp'  ,'paradise.webp','rocket.webp', 'numbers.webp']

  constructor() { }

   
  ngOnInit(): void {

    var today = new Date();
 
    
    this.date = today.toLocaleDateString();

    
    if(location.pathname.includes('/fr')){
      this.eulaLink = "/fr/eula"
    }

  }

  public async generateCard(){


    var mnemonic = this.words;
    var address = this.address;
    var password = this.password;

    if(this.createWallet){
      this.loading = true;
    }
    setTimeout(t => {
    
      if(this.createWallet){
        var tempmonic = generateMnemonicWords();
        
        // if(this.isolatePassword){
        //   password = "GFT"+ this.makepswd(11);
        // }else{
        //   password = "GFT"+ this.makepswd(4);
        // }
        
        mnemonic = joinMnemonicWords(tempmonic);
        address = this.getAddress(tempmonic);
      }

      var printWindow = window.open('/assets/blank.html', '', '');

      printWindow.document.title = this.t("cardano_gift_card");
      printWindow.document.write('<html><head><title>'+ this.t("cardano_gift_card") +'</title>');
      
      if(location.pathname.includes('/fr')){
        printWindow.document.write('<link type="text/css" rel="stylesheet" href="/assets/giftcards_fr.css" />'); 
      }else{
        printWindow.document.write('<link type="text/css" rel="stylesheet" href="/assets/giftcards.css" />'); 
      }
   
      if(this.createWallet){
        printWindow.document.write("<script>function copyAdd(){var copyText = document.getElementById('address');navigator.clipboard.writeText(copyText.textContent);alert('"+ this.t("address_copied") +"'); }</script>")
      }

      printWindow.document.write('</head><body>');

      if(this.createWallet){
        printWindow.document.write('<div class="div-btn"><h3>1. '+ this.t("make_sure_to_save") +'</h3><button onclick="window.print()">'+ this.t("print_save_as") +'</button><h3>2. '+ this.t("remove_any_space") +'</h3><button class="teal" onclick="copyAdd()">'+ this.t("copy_address") +'</button></div>');
      }else{
        printWindow.document.write('<div class="div-btn"><h3></h3><button onclick="window.print()">'+ this.t("print_save_as") +'</button><h3></h3></div>');
      }

      printWindow.document.write(document.getElementById("gift-card-wrapper").innerHTML.replace(this.words, mnemonic).replace(this.address,address).replace(this.password,password));
      printWindow.document.write('<div class="disclaimer" >'+ this.t('disclaimer')+'</div>');
      printWindow.document.write('<div class="instructions" style="text-align: center; font-size: 1.2em;"> <div style="margin-left: auto; margin-right: auto; "><h3 >'+this.t('how_to_retrieve') +'</h3> <p>'+this.t('someone_gifted_you') +'</p><h4 class="top-margin">1. '+  this.t('download_wallet')+'</h4> <p>'+ this.t("in_order_to_retrieve") +'</p> <ul style="width: fit-content; text-align: left; margin-left: auto; margin-right: auto;"> <li><b>yoroi-wallet:</b> <a target="_blank" href="https://www.yoroi-wallet.com/">yoroi-wallet.com</a></li> <li><b>daedalus:</b> <a target="_blank" href="https://daedaluswallet.io/">daedaluswallet.io</a></li> </ul> <h4 class="top-margin">2. '+ this.t("restore_wallet")+'</h4> <p>'+ this.t("your_gift_card_is") +'</p> <ul style="width: fit-content; text-align: left; margin-left: auto; margin-right: auto;"> <li><b>yoroi-wallet:</b> Add new wallet > Restore wallet > Cardano > Enter a 24 words recovery phrase</li> <li><b>daedalus:</b> Add wallet > Restore > Daedalus wallet > 24 words</li> </ul> <h4 class="top-margin">3. '+ this.t("move_funds_to_your") +'</h4> <p>'+this.t("once_you_can_access") +'</p> <ul style="width: fit-content; text-align: left; margin-left: auto; margin-right: auto;"> <li><b>yoroi-wallet:</b> Add new wallet > Create wallet > Cardano > Create wallet > (follow steps ...) > Receive</li> <li><b>daedalus:</b> Add wallet > Create > (follow steps ...) > Receive</li> </ul> <p>'+ this.t("go_to_your_gift_card") +'</p> <h4 class="top-margin">4. '+ this.t("stay_safe") +'</h4> <p>'+ this.t("you_should_be_good_to_go")+'</div> </p> <p style="font-size: 0.8em; margin-top:0; bottom: 0em; width: 100%; opacity: 0.8;">'+ this.t("brough_to_you_by") +' randomfrenchpool.com [RND🇫🇷] ('+ this.t("cardano_staking_pool") +').</p> </div>');
      printWindow.document.write('</body></html>');
      printWindow.document.close();

      // if(this.isolatePassword){
      //   printWindow.alert("Card password: "+ password +" (make sure you write it down)")
      //   var entry = printWindow.prompt("Enter card password","")
  
      //   if(entry != password){
      //     printWindow.close();
      //   }
      // }

      this.loading = false;
    },50);


  }



  public changeImage(i){
      this.selectedimg = i;
  }

  
  public toggleWalletCreation(){
    this.createWallet = !this.createWallet;
  }


  getAddress(mnemonicWords: string[]){

    const mainnet_networkId = 1;
    var accountIndex = 0;

    const mnemonic = joinMnemonicWords(mnemonicWords);
    const validMnemonic = bip39.validateMnemonic(mnemonic);
    if (!validMnemonic) throw new Error;
  
    const entropy = bip39.mnemonicToEntropy(mnemonic);
    const accountPrivateKey = CSL.Bip32PrivateKey.from_bip39_entropy(Buffer.from(entropy, 'hex'), Buffer.from(''))
      .derive(harden(1852))
      .derive(harden(1815))
      .derive(harden(accountIndex));
  
    const publicKey = accountPrivateKey.to_public();
    const stakeKey = publicKey.derive(2).derive(0);
  

    const utxoPubKey = publicKey.derive(0).derive(0);
    const baseAddr = CSL.BaseAddress.new(
        mainnet_networkId,
        CSL.StakeCredential.from_keyhash(utxoPubKey.to_raw_key().hash()),
        CSL.StakeCredential.from_keyhash(stakeKey.to_raw_key().hash())
    );
    
    return baseAddr.to_address().to_bech32();
    
  }
  
   
  makepswd(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * 
 charactersLength));
   }
   return result;
  }


  t(id){

    if(location.pathname.includes('/fr')){
      return stringFr['default'][''+id];
    }else{
      return stringEn['default'][''+ id];
    }
  }
  goback(){
    window.location.href = '/';
  }

}
