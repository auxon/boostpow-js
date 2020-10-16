'use strict';
var expect = require('chai').expect;
var index = require('../dist/index.js');

var bsv = require('bsv');
var sampleTx1 = '010000000174d9f6dc235207fbbcdff7bdc412dcb375eb634da698ed164cc1e9aa1b88729a040000006b4830450221008596410738406e0e8589292a0e7a4d960e739025ab1859a3df6c77b4cf8c59ac0220733024f199162bc7b9ccd648aae56f0a0e307558a9827a26d35b1016de1865c54121025a77fe27d1db166b660205ff08b97f7dd87c7c68edaa2931895c2c8577f1a351ffffffff027d20000000000000e108626f6f7374706f777504000000002035b8fcb6882f93bddb928c9872198bcdf057ab93ed615ad938f24a63abde588104ffff001d14000000000000000000000000000000000000000004000000002000000000000000000000000000000000000000000000000000000000000000007e7c557a766b7e52796b557a8254887e557a8258887e7c7eaa7c6b7e7e7c8254887e6c7e7c8254887eaa01007e816c825488537f7681530121a5696b768100a0691d00000000000000000000000000000000000000000000000000000000007e6c539458959901007e819f6976a96c88acb461590e000000001976a914ba6e459a2b505dc78e44e8c5874776c00890e16088ac00000000';
var sampleTx1Value = 8317;
var sampleTx1Vout = 0;
var sampleTx1id = '4eb545a588a21045495e74449b348ce1eb8f48ac95356c519a2a85a57731a518';

describe('boost #BoostPowJob create various getters and setters', () => {

   it('should be valid minimal', async () => {
      const job = index.BoostPowJob.fromObject({
         content: 'hello world',
         diff: 157416.40184364,
      });
      const jobObj = job.toObject();
      expect(jobObj).to.eql({
         content: Buffer.from('00000000000000000000000000000000000000000068656c6c6f20776f726c64', 'hex').toString('hex'),
         diff: 157416.40184364,
         category: "00000000",
         tag: '0000000000000000000000000000000000000000',
         additionalData: "0000000000000000000000000000000000000000000000000000000000000000",
         userNonce: "00000000",
      })
   });

   it('should output script asm', async () => {
      const job = index.BoostPowJob.fromObject({
         content: 'hello world',
         diff: 157416.40184364,
      });
      const jobObj = job.toASM();
      expect(jobObj).to.eql('626f6f7374706f77 OP_DROP 00000000 646c726f77206f6c6c6568000000000000000000000000000000000000000000 b3936a1a 0000000000000000000000000000000000000000 00000000 0000000000000000000000000000000000000000000000000000000000000000 OP_CAT OP_SWAP OP_5 OP_ROLL OP_DUP OP_TOALTSTACK OP_CAT OP_2 OP_PICK OP_TOALTSTACK OP_5 OP_ROLL OP_SIZE OP_4 OP_EQUALVERIFY OP_CAT OP_5 OP_ROLL OP_SIZE OP_8 OP_EQUALVERIFY OP_CAT OP_SWAP OP_CAT OP_HASH256 OP_SWAP OP_TOALTSTACK OP_CAT OP_CAT OP_SWAP OP_SIZE OP_4 OP_EQUALVERIFY OP_CAT OP_FROMALTSTACK OP_CAT OP_SWAP OP_SIZE OP_4 OP_EQUALVERIFY OP_CAT OP_HASH256 00 OP_CAT OP_BIN2NUM OP_FROMALTSTACK OP_SIZE OP_4 OP_EQUALVERIFY OP_3 OP_SPLIT OP_DUP OP_BIN2NUM OP_3 21 OP_WITHIN OP_VERIFY OP_TOALTSTACK OP_DUP OP_BIN2NUM 0 OP_GREATERTHAN OP_VERIFY 0000000000000000000000000000000000000000000000000000000000 OP_CAT OP_FROMALTSTACK OP_3 OP_SUB OP_8 OP_MUL OP_RSHIFT 00 OP_CAT OP_BIN2NUM OP_LESSTHAN OP_VERIFY OP_DUP OP_HASH160 OP_FROMALTSTACK OP_EQUALVERIFY OP_CHECKSIG');
   });

   it('should be valid full', async () => {
      const job = index.BoostPowJob.fromObject({
         content: 'hello world',
         diff: 157416.40184364,
         // Optional fields below
         category: '04d2',
         tag: 'animals',
         additionalData: 'additionalData here',
         // Optional and auto-generated
         userNonce: '913914e3',
      });

      const jobObj = job.toObject();
      expect(jobObj).to.eql({
         content: '00000000000000000000000000000000000000000068656c6c6f20776f726c64',
         diff: 157416.40184364,
         category: '000004d2',
         tag: index.BoostUtilsHelper.createBufferAndPad('animals', 20).reverse().toString('hex'),
         additionalData: index.BoostUtilsHelper.createBufferAndPad('additionalData here', 32).reverse().toString('hex'),
         userNonce: '913914e3',
      });
   });

   it('should generate output script Hex', async () => {
      const job = index.BoostPowJob.fromObject({
         content: '00000000000000000000000000000000000000000068656c6c6f20776f726c64',
         diff: 157416.40184364,
         category: '00000132',
         tag: '00000000000000000000000000616e696d616c73',
         additionalData: '000000000000000000000000006164646974696f6e616c446174612068657265',
         userNonce: '913914e3',
      });

      const outputScript = job.toHex();
      expect(outputScript).to.eql('08626f6f7374706f7775043201000020646c726f77206f6c6c656800000000000000000000000000000000000000000004b3936a1a14736c616d696e610000000000000000000000000004e3143991206572656820617461446c616e6f697469646461000000000000000000000000007e7c557a766b7e52796b557a8254887e557a8258887e7c7eaa7c6b7e7e7c8254887e6c7e7c8254887eaa01007e816c825488537f7681530121a5696b768100a0691d00000000000000000000000000000000000000000000000000000000007e6c539458959901007e819f6976a96c88ac');
      const jobFromHex = index.BoostPowJob.fromHex(outputScript);
      expect(jobFromHex.toObject()).to.eql(job.toObject());
   });


   it('should generate output script toString', async () => {
      const job = index.BoostPowJob.fromObject({
         content: '00000000000000000000000000000000000000000068656c6c6f20776f726c64',
         diff: 157416.40184364,
         category: '0132',
         tag: '00000000000000000000000000616e696d616c73',
         additionalData: '000000000000000000000000000000000000006d657461646174612068657265',
         userNonce: '913914e3',
      });

      const outputScript = job.toString();
      const jobFromHex = index.BoostPowJob.fromString(outputScript);
      expect(jobFromHex.toObject()).to.eql(job.toObject());

      expect(jobFromHex.toObject()).to.eql({
         content: '00000000000000000000000000000000000000000068656c6c6f20776f726c64',
         diff: 157416.40184364,
         category: '00000132',
         tag: '00000000000000000000000000616e696d616c73',
         additionalData: '000000000000000000000000000000000000006d657461646174612068657265',
         userNonce: '913914e3',
      });

      expect(outputScript).to.eql('8 0x626f6f7374706f77 OP_DROP 4 0x32010000 32 0x646c726f77206f6c6c6568000000000000000000000000000000000000000000 4 0xb3936a1a 20 0x736c616d696e6100000000000000000000000000 4 0xe3143991 32 0x6572656820617461646174656d00000000000000000000000000000000000000 OP_CAT OP_SWAP OP_5 OP_ROLL OP_DUP OP_TOALTSTACK OP_CAT OP_2 OP_PICK OP_TOALTSTACK OP_5 OP_ROLL OP_SIZE OP_4 OP_EQUALVERIFY OP_CAT OP_5 OP_ROLL OP_SIZE OP_8 OP_EQUALVERIFY OP_CAT OP_SWAP OP_CAT OP_HASH256 OP_SWAP OP_TOALTSTACK OP_CAT OP_CAT OP_SWAP OP_SIZE OP_4 OP_EQUALVERIFY OP_CAT OP_FROMALTSTACK OP_CAT OP_SWAP OP_SIZE OP_4 OP_EQUALVERIFY OP_CAT OP_HASH256 1 0x00 OP_CAT OP_BIN2NUM OP_FROMALTSTACK OP_SIZE OP_4 OP_EQUALVERIFY OP_3 OP_SPLIT OP_DUP OP_BIN2NUM OP_3 1 0x21 OP_WITHIN OP_VERIFY OP_TOALTSTACK OP_DUP OP_BIN2NUM OP_0 OP_GREATERTHAN OP_VERIFY 29 0x0000000000000000000000000000000000000000000000000000000000 OP_CAT OP_FROMALTSTACK OP_3 OP_SUB OP_8 OP_MUL OP_RSHIFT 1 0x00 OP_CAT OP_BIN2NUM OP_LESSTHAN OP_VERIFY OP_DUP OP_HASH160 OP_FROMALTSTACK OP_EQUALVERIFY OP_CHECKSIG');
   });

   it('should generate same formatted bits as bitcoin block 0000000000002917ed80650c6174aac8dfc46f5fe36480aaef682ff6cd83c3ca', async () => {
      const job = index.BoostPowJob.fromObject({
         content: '0000000000000b60bc96a44724fd72daf9b92cf8ad00510b5224c6253ac40095',
         diff: 157416.40184364,
         category: '00000001',
         tag: '00000000000000000000000000616e696d616c73',
         additionalData: '000000000000000000000000000000000000006d657461646174612068657265',
         userNonce: '913914e3',
      });

      const outputScript = job.toString();
      const jobFromHex = index.BoostPowJob.fromString(outputScript);
      expect(jobFromHex.toObject()).to.eql(job.toObject());

      expect(jobFromHex.toObject()).to.eql({
         content: '0000000000000b60bc96a44724fd72daf9b92cf8ad00510b5224c6253ac40095',
         diff: 157416.40184364,
         category: '00000001',
         tag: '00000000000000000000000000616e696d616c73',
         additionalData: '000000000000000000000000000000000000006d657461646174612068657265',
         userNonce: '913914e3',
      });

      expect(job.toObject()).to.eql({
         content: '0000000000000b60bc96a44724fd72daf9b92cf8ad00510b5224c6253ac40095',
         diff: 157416.40184364,
         category: '00000001',
         tag: '00000000000000000000000000616e696d616c73',
         additionalData: '000000000000000000000000000000000000006d657461646174612068657265',
         userNonce: '913914e3',
      });

   });

   it('should return error for too large and invalid values. content', async () => {
      try {
         index.BoostPowJob.fromObject({
            content: '330000000000000b60bc96a44724fd72daf9b92cf8ad00510b5224c6253ac40095',
            diff: 157416.40184364,
            category: '00000001',
            tag: '00000000000000000000000000616e696d616c73',
            additionalData: '000000000000000000000000000000000000006d657461646174612068657265',
            userNonce: '913914e3',
         });
      } catch (ex) {
         expect(ex.toString()).to.equal('Error: content too large. Max 32 bytes.');
         return;
      }
      expect(true).to.eql(false);
   });

   it('should return error for too large and invalid values. diff', async () => {
      try {
         index.BoostPowJob.fromObject({
            content: '0000000000000b60bc96a44724fd72daf9b92cf8ad00510b5224c6253ac40095',
            diff: null,
            category: '00000001',
            tag: '00000000000000000000000000616e696d616c73',
            additionalData: '000000000000000000000000000000000000006d657461646174612068657265',
            userNonce: '913914e3',
         });
      } catch (ex) {
         expect(ex.toString()).to.equal('Error: diff must be a number starting at 1. Max 4 bytes.');
         return;
      }
      expect(true).to.eql(false);
   });
   it('should return error for too large and invalid values. category', async () => {
      try {
         index.BoostPowJob.fromObject({
            content: '0000000000000b60bc96a44724fd72daf9b92cf8ad00510b5224c6253ac40095',
            diff: 1,
            category: '2300000001',
            tag: '00000000000000000000000000616e696d616c73',
            additionalData: '000000000000000000000000000000000000006d657461646174612068657265',
            userNonce: '913914e3',
         });
      } catch (ex) {
         expect(ex.toString()).to.equal('Error: category too large. Max 4 bytes.');
         return;
      }
      expect(true).to.eql(false);
   });

   it('should return error for too large and invalid values. tag', async () => {
      try {
         index.BoostPowJob.fromObject({
            content: '0000000000000b60bc96a44724fd72daf9b92cf8ad00510b5224c6253ac40095',
            diff: 1,
            category: '00000001',
            tag: '3200000000000000000000000000616e696d616c73',
            additionalData: '000000000000000000000000000000000000006d657461646174612068657265',
            userNonce: '913914e3',
         });
      } catch (ex) {
         expect(ex.toString()).to.equal('Error: tag too large. Max 20 bytes.');
         return;
      }
      expect(true).to.eql(false);
   });
   it('should return error for too large and invalid values. additionalData', async () => {
      try {
         index.BoostPowJob.fromObject({
            content: '0000000000000b60bc96a44724fd72daf9b92cf8ad00510b5224c6253ac40095',
            diff: 1,
            category: '00000001',
            tag: '00000000000000000000000000616e696d616c73',
            additionalData: '33000000000000000000000000000000000000006d657461646174612068657265',
            userNonce: '913914e3',
         });
      } catch (ex) {
         expect(ex.toString()).to.equal('Error: additionalData too large. Max 32 bytes.');
         return;
      }
      expect(true).to.eql(false);
   });

   it('should return error for too large and invalid values. userNonce', async () => {
      try {
         index.BoostPowJob.fromObject({
            content: '0000000000000b60bc96a44724fd72daf9b92cf8ad00510b5224c6253ac40095',
            diff: 1,
            category: '00000001',
            tag: '00000000000000000000000000616e696d616c73',
            additionalData: '000000000000000000000000000000000000006d657461646174612068657265',
            userNonce: '3300000000913914e3',
         });
      } catch (ex) {
         expect(ex.toString()).to.equal('Error: userNonce too large. Max 4 bytes.');
         return;
      }
      expect(true).to.eql(false);
   });
});

describe('boost #BoostPowString tryValidateJobProof', () => {
   it('tryValidateJobProof success valid pow mined', async () => {
      const job = index.BoostPowJob.fromRawTransaction('010000000174d9f6dc235207fbbcdff7bdc412dcb375eb634da698ed164cc1e9aa1b88729a040000006b4830450221008596410738406e0e8589292a0e7a4d960e739025ab1859a3df6c77b4cf8c59ac0220733024f199162bc7b9ccd648aae56f0a0e307558a9827a26d35b1016de1865c54121025a77fe27d1db166b660205ff08b97f7dd87c7c68edaa2931895c2c8577f1a351ffffffff027d20000000000000e108626f6f7374706f777504000000002035b8fcb6882f93bddb928c9872198bcdf057ab93ed615ad938f24a63abde588104ffff001d14000000000000000000000000000000000000000004000000002000000000000000000000000000000000000000000000000000000000000000007e7c557a766b7e52796b557a8254887e557a8258887e7c7eaa7c6b7e7e7c8254887e6c7e7c8254887eaa01007e816c825488537f7681530121a5696b768100a0691d00000000000000000000000000000000000000000000000000000000007e6c539458959901007e819f6976a96c88acb461590e000000001976a914ba6e459a2b505dc78e44e8c5874776c00890e16088ac00000000');
      /*
      >>>>>>>>>>>>>>>>>>> checkShare >>>>>>>>>>>>>>>>>>>
      211193-Mar 15 05:43:40 ip-172-31-47-53 sserver[30281]: I0315 05:43:40.175833 30281 StratumServerBitcoin.cc:336] coinbase tx:
      // Original real:
      00000000000000000000000000000000000000009fb8cb68b8850a13c7438e26e1d277b748be657a0a00000abf07000000000000000000000000000000000000000000000000000000000000000000000000000000000000
      211194-Mar 15 05:43:40 ip-172-31-47-53 sserver[30281]: I0315 05:43:40.175880 30327 StratumServerBitcoin.cc:632] >>>>>>>>>>>>>>>>>>> checkingFoundNewBlock >>>>>>>>>>>>>>>>>>>
      211195:Mar 15 05:43:40 ip-172-31-47-53 sserver[30281]: I0315 05:43:40.175889 30327 StratumServerBitcoin.cc:637] >>>>>>>>>>>>>>>>>>> FOUND BLOCK FOUND >>>>>>>>>>>>>>>>>>>
      211196-Mar 15 05:43:40 ip-172-31-47-53 sserver[30281]: I0315 05:43:40.175894 30327 StratumServerBitcoin.cc:642] CBlockHeader nVersion: 00000000, hashPrevBlock: 8158deab634af238d95a61ed93ab57f0cd8b1972988c92dbbd932f88b6fcb835, hashMerkleRoot: 7687b9ef4a2a8bc0387336177e4f90ceabca3cbdf246ad4e9f27d4d94f1f4019, nTime: 5e6dc081, nBits: 1d00ffff, nNonce: 1ca169e0, extraNonce1: 0a00000a, extraNonce2: bf07000000000000
      211197-Mar 15 05:43:40 ip-172-31-47-53 sserver[30281]: I0315 05:43:40.175958 30327 StratumServerBitcoin.cc:684] >>>> found a new block: 0000000000f0e97bec0c369dd6c7cbde0243a351d8ab138778717c63660afa35, jobId: 6804306268015034369, userId: 35, by: shedminer.002 <<<<
      211198-Mar 15 05:43:40 ip-172-31-47-53 sserver[30281]: I0315 05:43:40.175973 30327 StratumServerBitcoin.cc:689] >>>> found a new block_boost: 0000000000f0e97bec0c369dd6c7cbde0243a351d8ab138778717c63660afa35, jobId: 6804306268015034369, userId: 35, by: shedminer.002 <<<<0 <<<<8158deab634af238d95a61ed93ab57f0cd8b1972988c92dbbd932f88b6fcb835 <<<<7687b9ef4a2a8bc0387336177e4f90ceabca3cbdf246ad4e9f27d4d94f1f4019 <<<<1584251009 <<<<486604799 <<<<480340448
      211199-Mar 15 05:43:40 ip-172-31-47-53 sserver[30281]: I0315 05:43:40.175994 30327 StratumServerBitcoin.cc:710] high diff share, blkhash: 0000000000f0e97bec0c369dd6c7cbde0243a351d8ab138778717c63660afa35, diff: 272, networkDiff: 1, by: shedminer.002
      */
      const jobProof = index.BoostPowJobProof.fromObject({
         signature: '00',
         minerPubKey: '00',
         extraNonce1: Buffer.from('0a00000a', 'hex').toString('hex'),
         extraNonce2: Buffer.from('bf07000000000000', 'hex').toString('hex'),
         time: Buffer.from('5e6dc081', 'hex').toString('hex'),
         nonce:  Buffer.from('1ca169e0', 'hex').toString('hex'),
         minerPubKeyHash: Buffer.from('9fb8cb68b8850a13c7438e26e1d277b748be657a', 'hex').toString('hex'),
      });
      const result = index.BoostPowJob.tryValidateJobProof(job, jobProof, false);
      expect(result.boostPowString.hash()).to.eql('0000000000f0e97bec0c369dd6c7cbde0243a351d8ab138778717c63660afa35');
      expect(result.boostPowMetadata.hash()).to.eql('7687b9ef4a2a8bc0387336177e4f90ceabca3cbdf246ad4e9f27d4d94f1f4019');
      expect(result.boostPowString.metadataHash()).to.eql(result.boostPowMetadata.hash());
   });
});


describe('boost #fromTransactions decode known tx', () => {
   it('succeeds test_decode', async () => {
      const jobs = index.BoostPowJob.fromTransactionGetAllOutputs(new bsv.Transaction(
         '010000000107f3664fd5da563fd5716fe641bc6924c171c3558b35151aaf45156054c43c27000000006a47304402201ab947a7010271fcf5e4602c8e7cd448315579fb8f36ef61376b4f6d411ea0c3022030a436fa51e8a57a0443c6c6c4888e3b972b7be5706d8173a11bc90a297eb874412103727f42181e2293b47910789105ab63ded087b52bbc7a8a98c89cac4e91ee002fffffffff020807000000000000e108626f6f7374706f7775040000000020000000000000000000000000000000000000000000000000000000000000000004a0aa0a1c14000000000000000000000000000000000000000004000000002007f3664fd5da563fd5716fe641bc6924c171c3558b35151aaf45156054c43c277e7c557a766b7e52796b557a8254887e557a8258887e7c7eaa7c6b7e7e7c8254887e6c7e7c8254887eaa01007e816c825488537f7681530121a5696b768100a0691d00000000000000000000000000000000000000000000000000000000007e6c539458959901007e819f6976a96c88ac0807000000000000e108626f6f7374706f7775040000000020000000000000000000000000000000000000000000000000000000000000000004a0aa0a1c14000000000000000000000000000000000000000004000000002007f3664fd5da563fd5716fe641bc6924c171c3558b35151aaf45156054c43c277e7c557a766b7e52796b557a8254887e557a8258887e7c7eaa7c6b7e7e7c8254887e6c7e7c8254887eaa01007e816c825488537f7681530121a5696b768100a0691d00000000000000000000000000000000000000000000000000000000007e6c539458959901007e819f6976a96c88ac00000000'
         ));

      expect(jobs).to.eql([
         jobs[0].toASM(),
         jobs[1].toASM()
      ]);

   });
});




describe('boost #BoostPowJob createRedeemTransaction', () => {
   it('createRedeemTransaction success', async () => {
      // const job = index.BoostPowJob.fromRawTransaction('01000000013cdee5edfaec88f5ec5d4048c35ba1ed595a5c3dc8efc5360f8a26ec08621dcb010000006b483045022100af4682a0b78dc943f0f0f7fa85d3b4efe7291cad3f33a615e195f59b7d6c56f402207ee620e1848986128c95c07f1e2110fc1d165075bd6b4cbd2c1e24a9c566840b4121021e25de581fcd348717345e8f4c1996990b42f5914e1942b8356292100e43d427ffffffff02c922000000000000fd500108626f6f7374706f777504000000002035b8fcb6882f93bddb928c9872198bcdf057ab93ed615ad938f24a63abde588104ffff001d14000000000000000000000000000000000000000004000000002000000000000000000000000000000000000000000000000000000000000000007e7c557a766b7e5279825488537f7653a269760120a1696b1d00000000000000000000000000000000000000000000000000000000007e6c5394986b557a8254887e557a8258887e7c7eaa517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c6b7e7e7c8254887e6c7e7c8254887eaa6c9f6976a96c88ace88df104000000001976a91432accdcb557ed57b9f01b4c42d69d4c9ea5d972a88ac00000000');
      const job = index.BoostPowJob.fromRawTransaction('010000000174d9f6dc235207fbbcdff7bdc412dcb375eb634da698ed164cc1e9aa1b88729a040000006b4830450221008596410738406e0e8589292a0e7a4d960e739025ab1859a3df6c77b4cf8c59ac0220733024f199162bc7b9ccd648aae56f0a0e307558a9827a26d35b1016de1865c54121025a77fe27d1db166b660205ff08b97f7dd87c7c68edaa2931895c2c8577f1a351ffffffff027d20000000000000e108626f6f7374706f777504000000002035b8fcb6882f93bddb928c9872198bcdf057ab93ed615ad938f24a63abde588104ffff001d14000000000000000000000000000000000000000004000000002000000000000000000000000000000000000000000000000000000000000000007e7c557a766b7e52796b557a8254887e557a8258887e7c7eaa7c6b7e7e7c8254887e6c7e7c8254887eaa01007e816c825488537f7681530121a5696b768100a0691d00000000000000000000000000000000000000000000000000000000007e6c539458959901007e819f6976a96c88acb461590e000000001976a914ba6e459a2b505dc78e44e8c5874776c00890e16088ac00000000');
      expect(job.getTxid()).to.eql('4eb545a588a21045495e74449b348ce1eb8f48ac95356c519a2a85a57731a518');
      /*
      >>>>>>>>>>>>>>>>>>> checkShare >>>>>>>>>>>>>>>>>>>
      211193-Mar 15 05:43:40 ip-172-31-47-53 sserver[30281]: I0315 05:43:40.175833 30281 StratumServerBitcoin.cc:336] coinbase tx:
      // Original reaL:
      00000000000000000000000000000000000000009fb8cb68b8850a13c7438e26e1d277b748be657a0a00000abf07000000000000000000000000000000000000000000000000000000000000000000000000000000000000
      211194-Mar 15 05:43:40 ip-172-31-47-53 sserver[30281]: I0315 05:43:40.175880 30327 StratumServerBitcoin.cc:632] >>>>>>>>>>>>>>>>>>> checkingFoundNewBlock >>>>>>>>>>>>>>>>>>>
      211195:Mar 15 05:43:40 ip-172-31-47-53 sserver[30281]: I0315 05:43:40.175889 30327 StratumServerBitcoin.cc:637] >>>>>>>>>>>>>>>>>>> FOUND BLOCK FOUND >>>>>>>>>>>>>>>>>>>
      211196-Mar 15 05:43:40 ip-172-31-47-53 sserver[30281]: I0315 05:43:40.175894 30327 StratumServerBitcoin.cc:642] CBlockHeader nVersion: 00000000, hashPrevBlock: 8158deab634af238d95a61ed93ab57f0cd8b1972988c92dbbd932f88b6fcb835, hashMerkleRoot: 7687b9ef4a2a8bc0387336177e4f90ceabca3cbdf246ad4e9f27d4d94f1f4019, nTime: 5e6dc081, nBits: 1d00ffff, nNonce: 1ca169e0, extraNonce1: 0a00000a, extraNonce2: bf07000000000000
      211197-Mar 15 05:43:40 ip-172-31-47-53 sserver[30281]: I0315 05:43:40.175958 30327 StratumServerBitcoin.cc:684] >>>> found a new block: 0000000000f0e97bec0c369dd6c7cbde0243a351d8ab138778717c63660afa35, jobId: 6804306268015034369, userId: 35, by: shedminer.002 <<<<
      211198-Mar 15 05:43:40 ip-172-31-47-53 sserver[30281]: I0315 05:43:40.175973 30327 StratumServerBitcoin.cc:689] >>>> found a new block_boost: 0000000000f0e97bec0c369dd6c7cbde0243a351d8ab138778717c63660afa35, jobId: 6804306268015034369, userId: 35, by: shedminer.002 <<<<0 <<<<8158deab634af238d95a61ed93ab57f0cd8b1972988c92dbbd932f88b6fcb835 <<<<7687b9ef4a2a8bc0387336177e4f90ceabca3cbdf246ad4e9f27d4d94f1f4019 <<<<1584251009 <<<<486604799 <<<<480340448
      211199-Mar 15 05:43:40 ip-172-31-47-53 sserver[30281]: I0315 05:43:40.175994 30327 StratumServerBitcoin.cc:710] high diff share, blkhash: 0000000000f0e97bec0c369dd6c7cbde0243a351d8ab138778717c63660afa35, diff: 272, networkDiff: 1, by: shedminer.002
      */
      const jobProof = index.BoostPowJobProof.fromObject({
         signature: '00',
         minerPubKey: '020370f418d21765b33bc093db143aa1dd5cfefc97275652dc8396c2d567f93d65',
         extraNonce1: Buffer.from('0a00000a', 'hex').toString('hex'),
         extraNonce2: Buffer.from('bf07000000000000', 'hex').toString('hex'),
         time: Buffer.from('5e6dc081', 'hex').toString('hex'),
         nonce: Buffer.from('1ca169e0', 'hex').toString('hex'),
         minerPubKeyHash: Buffer.from('9fb8cb68b8850a13c7438e26e1d277b748be657a', 'hex').toString('hex'),
      });
      const powString = index.BoostPowJob.tryValidateJobProof(job, jobProof);
      expect(powString.boostPowString.toString()).to.eql('0000000035b8fcb6882f93bddb928c9872198bcdf057ab93ed615ad938f24a63abde588119401f4fd9d4279f4ead46f2bd3ccaabce904f7e17367338c08b2a4aefb9877681c06d5effff001de069a11c');
      expect(powString.boostPowString.hash()).to.eql('0000000000f0e97bec0c369dd6c7cbde0243a351d8ab138778717c63660afa35');

      expect(jobProof.toObject()).to.eql({
         "extraNonce1": "0a00000a",
         "extraNonce2": "bf07000000000000",
         "minerPubKey": "020370f418d21765b33bc093db143aa1dd5cfefc97275652dc8396c2d567f93d65",
         "minerPubKeyHash": "9fb8cb68b8850a13c7438e26e1d277b748be657a",
         "nonce": "1ca169e0",
         "signature": "00",
         "time": "5e6dc081",
      });

      let tx = index.BoostPowJob.createRedeemTransaction(job, jobProof, '5d5c870220eeb18afe8a498324013955c316cbaaed2a824e5230362c36964c27', '1264UeZnzrjrMdYn1QSED5TCbY8Gd11e23');
      expect(tx.toString()).to.eql('010000000118a53177a5852a9a516c3595ac488febe18c349b44745e494510a288a545b54e0000000098483045022100aa9c8d5cd3b975e00305122b9ce5ce965565f4e36f6dce24870da45fb153636102201aa4ddcd5fa69b73ff498d309de137c5c0c82b32ddd3b864aabe96973e4afc414121020370f418d21765b33bc093db143aa1dd5cfefc97275652dc8396c2d567f93d6504e069a11c0481c06d5e08bf07000000000000040a00000a149fb8cb68b8850a13c7438e26e1d277b748be657affffffff01781e0000000000001976a9140bed1b97a1ec681cf100ee8b11800a54b39b9fda88ac00000000');
   });
});



describe('BoostPowJob', () => {
   it('should correctly set txid if provided from all loaders', async () => {
      let job;
      job = index.BoostPowJob.fromRawTransaction(sampleTx1);
      expect(job.getTxOutpoint()).to.eql({
         txid: sampleTx1id,
         vout: sampleTx1Vout,
         value: sampleTx1Value,
      });

      job = index.BoostPowJob.fromObject({
         content: '0000000000000b60bc96a44724fd72daf9b92cf8ad00510b5224c6253ac40095',
         diff: 157416.40184364,
         category: '00000001',
         tag: '00000000000000000000000000616e696d616c73',
         additionalData: '0e60651a9934e8f0decd1c5fde39309e48fca0cd1c84a21ddfde95033762d86c',
         userNonce: '913914e3',
      }, '32617d4a0477a15cabf65e3731c8cf604861956826bdf3338e346c7dacdd5a5c', 0)

      expect(job.getTxOutpoint()).to.eql({
         txid: undefined,
         vout: undefined,
         value: undefined,
      });

      job = index.BoostPowJob.fromASM(job.toASM(),'32617d4a0477a15cabf65e3731c8cf604861956826bdf3338e346c7dacdd5a5c', 2, 3432);
      expect(job.getTxOutpoint()).to.eql({
         txid: '32617d4a0477a15cabf65e3731c8cf604861956826bdf3338e346c7dacdd5a5c',
         vout: 2,
         value: 3432
      });
      expect(job.getTxid()).to.eql('32617d4a0477a15cabf65e3731c8cf604861956826bdf3338e346c7dacdd5a5c');
      expect(job.getVout()).to.eql(2);
      expect(job.getValue()).to.eql(3432);
   });

   it('should correctly get content and buffers as appropriate', async () => {
      const job = index.BoostPowJob.fromObject({
         content: index.BoostUtilsHelper.createBufferAndPad('hello animal', 32).reverse().toString('hex'),
         diff: 21,
         category: index.BoostUtilsHelper.createBufferAndPad('bill', 4).reverse().toString('hex'),
         tag: index.BoostUtilsHelper.createBufferAndPad('this is a tag', 20).reverse().toString('hex'),
         additionalData: index.BoostUtilsHelper.createBufferAndPad('this is more additionalData', 32).reverse().toString('hex'),
         userNonce: index.BoostUtilsHelper.createBufferAndPad('01c8', 4).reverse().toString('hex')
      });

      expect(!!job.getScriptHash()).to.eql(true);
      expect(!!job.getId()).to.eql(true);
      expect(job.getDiff()).to.eql(21);
      expect(job.getUserNonceBuffer().toString('hex')).to.eql('c8010000');
      expect(job.getUserNonceHex()).to.eql('000001c8');
      expect(job.getUserNonce()).to.eql(456);

      expect(job.getContentString()).to.eql('hello animal');
      expect(job.getContentBuffer().toString('hex')).to.eql('6c616d696e61206f6c6c65680000000000000000000000000000000000000000');
      expect(job.getContentHex()).to.eql('000000000000000000000000000000000000000068656c6c6f20616e696d616c');

      expect(job.getTagString()).to.eql('this is a tag');
      expect(job.getTagBuffer().toString('hex')).to.eql('6761742061207369207369687400000000000000');
      expect(job.getTagHex()).to.eql('0000000000000074686973206973206120746167');

      expect(job.getCategoryString()).to.eql('bill');
      expect(job.getCategoryBuffer().toString('hex')).to.eql('6c6c6962');
      expect(job.getCategoryHex()).to.eql('62696c6c');

      expect(job.getAdditionalDataString()).to.eql('this is more additionalData');
      expect(job.getAdditionalDataBuffer().toString('hex')).to.eql('617461446c616e6f6974696464612065726f6d20736920736968740000000000');
      expect(job.getAdditionalDataHex()).to.eql('000000000074686973206973206d6f7265206164646974696f6e616c44617461');

   });

   it('should correctly match up forms of variables for pow string and pow job', async () => {
      const boostPowString = index.BoostPowString.fromString('01000000646c726f77206f6c6c65480000000000000000000000000000000000000000002a96153663424ecfd483872e26e59bb02fd781a965df6575c437b0848e27d8aca6c8cb4dffff001dae5172dc');
      expect(boostPowString.hash()).to.equal('0000000086915e291fe43f10bdd8232f65e6eb64628bbb4d128be3836c21b6cc');
      expect(boostPowString.toObject()).to.eql({
         hash: '0000000086915e291fe43f10bdd8232f65e6eb64628bbb4d128be3836c21b6cc',
         content: '00000000000000000000000000000000000000000048656c6c6f20776f726c64',
         bits: 486604799,
         difficulty: 1,
         metadataHash: "acd8278e84b037c47565df65a981d72fb09be5262e8783d4cf4e42633615962a",
         time: 1305200806,
         nonce: 3698479534,
         category: 1,
      });

      const job = index.BoostPowJob.fromHex(
         index.BoostPowJob.fromASM(
            index.BoostPowJob.fromObject(
            {
               content: '00000000000000000000000000000000000000000048656c6c6f20776f726c64',
               diff: 1,
               category: '01',
               tag:  '02',
               additionalData: '03',
               userNonce: '44',
            }).toASM()
         ).toHex()
      );

      expect(boostPowString.bits()).to.eql(486604799);
      expect(job.bits()).to.eql(486604799);
      expect(boostPowString.bits().toString(16)).to.eql('1d00ffff');
      expect(job.bits().toString(16)).to.eql('1d00ffff');
      expect(boostPowString.difficulty()).to.eql(1);
      expect(job.getDifficulty()).to.eql(1);
   });

   it('should correctly match target and bits for known bitcoin header 0000000000002917ed80650c6174aac8dfc46f5fe36480aaef682ff6cd83c3ca', async () => {
      const job = index.BoostPowJob.fromHex(
         index.BoostPowJob.fromASM(
            index.BoostPowJob.fromObject(
            {
               content: '00000000000000000000000000000000000000000048656c6c6f20776f726c64',
               diff: 157416.4018436489,
               category: '01',
               tag:  '02',
               additionalData: '03',
               userNonce: '44',
            }).toASM()
         ).toHex()
      );
      expect(job.bits()).to.eql(443192243);
      expect(job.bits().toString(16)).to.eql('1a6a93b3');
      expect(job.getDifficulty()).to.eql(157416.40184364);
      expect(index.BoostPowJob.hexBitsToDifficulty('1a6a93b3')).to.eql(157416.40184364);
   });

   it('should correctly get bits and target and category number', async () => {
      const prodBitsSample = index.BoostPowJob.hexBitsToDifficulty('1802f15b');
      expect(prodBitsSample).to.eql(373622670066.215);
   });


   it('should correctly get content and buffers as appropriate', async () => {
      const job = index.BoostPowJob.fromObject({
         content: index.BoostUtilsHelper.createBufferAndPad('hello animal', 32).reverse().toString('hex'),
         diff: 21.00002253,
         category: index.BoostUtilsHelper.createBufferAndPad('bill', 4).reverse().toString('hex'),
         tag: index.BoostUtilsHelper.createBufferAndPad('this is a tag', 20).reverse().toString('hex'),
         additionalData: index.BoostUtilsHelper.createBufferAndPad('this is more additionalData', 32).reverse().toString('hex'),
         userNonce: index.BoostUtilsHelper.createBufferAndPad('01c8', 4).reverse().toString('hex')
      });

      expect(job.toString()).to.eql('8 0x626f6f7374706f77 OP_DROP 4 0x6c6c6962 32 0x6c616d696e61206f6c6c65680000000000000000000000000000000000000000 4 0xb6300c1c 20 0x6761742061207369207369687400000000000000 4 0xc8010000 32 0x617461446c616e6f6974696464612065726f6d20736920736968740000000000 OP_CAT OP_SWAP OP_5 OP_ROLL OP_DUP OP_TOALTSTACK OP_CAT OP_2 OP_PICK OP_TOALTSTACK OP_5 OP_ROLL OP_SIZE OP_4 OP_EQUALVERIFY OP_CAT OP_5 OP_ROLL OP_SIZE OP_8 OP_EQUALVERIFY OP_CAT OP_SWAP OP_CAT OP_HASH256 OP_SWAP OP_TOALTSTACK OP_CAT OP_CAT OP_SWAP OP_SIZE OP_4 OP_EQUALVERIFY OP_CAT OP_FROMALTSTACK OP_CAT OP_SWAP OP_SIZE OP_4 OP_EQUALVERIFY OP_CAT OP_HASH256 1 0x00 OP_CAT OP_BIN2NUM OP_FROMALTSTACK OP_SIZE OP_4 OP_EQUALVERIFY OP_3 OP_SPLIT OP_DUP OP_BIN2NUM OP_3 1 0x21 OP_WITHIN OP_VERIFY OP_TOALTSTACK OP_DUP OP_BIN2NUM OP_0 OP_GREATERTHAN OP_VERIFY 29 0x0000000000000000000000000000000000000000000000000000000000 OP_CAT OP_FROMALTSTACK OP_3 OP_SUB OP_8 OP_MUL OP_RSHIFT 1 0x00 OP_CAT OP_BIN2NUM OP_LESSTHAN OP_VERIFY OP_DUP OP_HASH160 OP_FROMALTSTACK OP_EQUALVERIFY OP_CHECKSIG');
      const str = job.toString();
      expect(job.toObject()).to.eql(index.BoostPowJob.fromString(str).toObject());
   });

   it('should correctly get bits and target and category number', async () => {
      let job = index.BoostPowJob.fromObject({
         content: index.BoostUtilsHelper.createBufferAndPad('hello animal', 32).reverse().toString('hex'),
         diff: 1,
         category: Number(123).toString(16),
         tag: index.BoostUtilsHelper.createBufferAndPad('this is a tag', 20).reverse().toString('hex'),
         additionalData: index.BoostUtilsHelper.createBufferAndPad('this is more additionalData', 32).reverse().toString('hex'),
         userNonce: index.BoostUtilsHelper.createBufferAndPad('01c8', 4).reverse().toString('hex')
      });

      expect(job.getBits()).to.eql(486604799);
      expect(job.getBitsHex()).to.eql('1d00ffff');
      expect(job.getBits().toString(16)).to.eql('1d00ffff');
      expect(job.getCategoryNumber()).to.eql(123);
      expect(job.getUserNonceNumber()).to.eql(456);

      job = index.BoostPowJob.fromObject({
         content: index.BoostUtilsHelper.createBufferAndPad('hello animal', 32).reverse().toString('hex'),
         diff: 409786762471.9213,
         category: Number(123).toString(16),
         tag: index.BoostUtilsHelper.createBufferAndPad('this is a tag', 20).reverse().toString('hex'),
         additionalData: index.BoostUtilsHelper.createBufferAndPad('this is more additionalData', 32).reverse().toString('hex'),
         userNonce: index.BoostUtilsHelper.createBufferAndPad('01c8', 4).reverse().toString('hex')
      });
      expect(job.getDiff()).to.eql(409786762471.9213);
      expect(job.getBits()).to.eql(402829022);
      expect(job.getBitsHex()).to.eql('1802aede');
      expect(job.getBits().toString(16)).to.eql('1802aede');
   });

   it('should correctly get content and buffers as appropriate capitalists', async () => {
      const hashed = index.BoostUtilsHelper.getSha256('Capitalists can spend more energy than socialists.');
      const job = index.BoostPowJob.fromObject({
         content: index.BoostUtilsHelper.createBufferAndPad(hashed, 32).toString('hex'),
         diff: 21,
         category: index.BoostUtilsHelper.createBufferAndPad('bill', 4).reverse().toString('hex'),
         tag: index.BoostUtilsHelper.createBufferAndPad('this is a tag', 20).reverse().toString('hex'),
         additionalData: index.BoostUtilsHelper.createBufferAndPad('this is more additionalData', 32).reverse().toString('hex'),
         userNonce: index.BoostUtilsHelper.createBufferAndPad('01c8', 4).reverse().toString('hex')
      });
      expect(job.getContentHex()).to.eql('35b8fcb6882f93bddb928c9872198bcdf057ab93ed615ad938f24a63abde5881');
   });

});