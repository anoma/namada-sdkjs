use crate::crypto::pointer_types::{
    new_vec_string_pointer, StringPointer, VecStringPointer, VecU8Pointer,
};
use bip39::{Language, Mnemonic as M, MnemonicType, Seed};
use thiserror::Error;
use wasm_bindgen::prelude::*;
use zeroize::Zeroize;

#[derive(Debug, Error)]
pub enum Bip39Error {
    #[error("Invalid phrase")]
    InvalidPhrase,
    #[error("Invalid phrase size! Must be 12 or 24!")]
    InvalidPhraseSize,
}

#[wasm_bindgen]
pub struct Mnemonic {
    mnemonic: M,
}

#[wasm_bindgen]
impl Mnemonic {
    #[wasm_bindgen(constructor)]
    pub fn new(size: u8) -> Result<Mnemonic, String> {
        let mnemonic_type = match size {
            12 => MnemonicType::Words12,
            24 => MnemonicType::Words24,
            _ => return Err(Bip39Error::InvalidPhraseSize.to_string()),
        };

        let mnemonic = M::new(mnemonic_type, Language::English);

        Ok(Mnemonic { mnemonic })
    }

    pub fn validate(phrase: &str) -> bool {
        M::validate(phrase, Language::English).is_ok()
    }

    pub fn from_phrase(mut phrase: String) -> Result<Mnemonic, String> {
        // First validate phrase, provide error to client if this fails
        M::validate(&phrase, Language::English).map_err(|e| format!("{}", e))?;

        let mnemonic = M::from_phrase(&phrase, Language::English)
            .map_err(|e| format!("{}: {:?}", Bip39Error::InvalidPhrase, e))?;

        phrase.zeroize();

        Ok(Mnemonic { mnemonic })
    }

    pub fn to_seed(&self, passphrase: Option<StringPointer>) -> Result<VecU8Pointer, String> {
        let mut passphrase = match passphrase {
            Some(passphrase) => passphrase.string.clone(),
            None => "".into(),
        };

        let seed = Seed::new(&self.mnemonic, &passphrase);
        passphrase.zeroize();

        Ok(VecU8Pointer::new(Vec::from(seed.as_bytes())))
    }

    pub fn to_words(&self) -> Result<VecStringPointer, String> {
        let words: Vec<String> = self
            .mnemonic
            .phrase()
            .split(' ')
            .map(String::from)
            .collect();
        Ok(new_vec_string_pointer(words))
    }

    pub fn phrase(&self) -> String {
        String::from(self.mnemonic.phrase())
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use wasm_bindgen_test::*;

    #[wasm_bindgen_test]
    fn can_generate_mnemonic_from_size() {
        let mnemonic = Mnemonic::new(12).unwrap();
        let phrase = mnemonic.phrase();
        let words: Vec<&str> = phrase.split(' ').collect();

        assert_eq!(words.iter().len(), 12);

        let mnemonic = Mnemonic::new(24).unwrap();
        let phrase = mnemonic.phrase();
        let words: Vec<&str> = phrase.split(' ').collect();

        assert_eq!(words.iter().len(), 24);
    }

    #[wasm_bindgen_test]
    fn can_generate_seed_from_phrase() {
        let phrase = "caught pig embody hip goose like become worry face oval manual flame \
                      pizza steel viable proud eternal speed chapter sunny boat because view bullet";
        let mnemonic = Mnemonic::from_phrase(phrase.into()).unwrap();
        let seed = mnemonic
            .to_seed(None)
            .expect("Should return seed from mnemonic phrase");

        assert_eq!(seed.vec.len(), 64);
    }

    #[wasm_bindgen_test]
    fn can_restore_seed_from_phrase() {
        let phrase = "caught pig embody hip goose like become worry face oval manual flame \
                      pizza steel viable proud eternal speed chapter sunny boat because view bullet";
        let seed_bytes = vec![
            178, 64, 160, 168, 33, 68, 84, 63, 0, 137, 121, 29, 66, 47, 123, 36, 64, 38, 160, 236,
            93, 38, 53, 157, 169, 119, 42, 153, 188, 80, 209, 149, 51, 92, 251, 168, 150, 220, 70,
            78, 230, 16, 152, 160, 85, 248, 115, 82, 183, 126, 96, 112, 58, 238, 230, 63, 89, 239,
            0, 250, 163, 169, 166, 174,
        ];
        let mnemonic = Mnemonic::from_phrase(phrase.into()).unwrap();
        let seed = mnemonic
            .to_seed(None)
            .expect("Should return seed from mnemonic phrase");

        assert_eq!(seed.vec, seed_bytes);
    }

    #[wasm_bindgen_test]
    fn invalid_phrase_should_panic() {
        let bad_phrase = "caught pig embody hip goose like become";
        let res = Mnemonic::from_phrase(bad_phrase.into());

        assert!(res.is_err());
    }

    #[wasm_bindgen_test]
    fn can_generate_word_list_from_mnemonic() {
        let mnemonic = Mnemonic::new(12).unwrap();
        let words = mnemonic
            .to_words()
            .expect("Should return a VecStringPointer containing the words");

        assert_eq!(words.strings.len(), 12);

        let mnemonic = Mnemonic::new(24).unwrap();
        let words = mnemonic
            .to_words()
            .expect("Should return a VecStringPointer containing the words");

        assert_eq!(words.strings.len(), 24);
    }
}
