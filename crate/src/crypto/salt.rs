use password_hash::{rand_core::OsRng, SaltString};
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub struct Salt {
    salt: SaltString,
}

#[wasm_bindgen]
impl Salt {
    #[wasm_bindgen(constructor)]
    pub fn new(salt: String) -> Result<Salt, String> {
        let salt = SaltString::from_b64(&salt).map_err(|err| err.to_string())?;

        Ok(Salt { salt })
    }

    pub fn generate() -> Self {
        Self {
            salt: SaltString::generate(&mut OsRng),
        }
    }

    pub fn as_string(&self) -> String {
        self.salt.to_string()
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use wasm_bindgen_test::*;

    #[wasm_bindgen_test]
    fn can_generate_salt_from_string() {
        let salt_string = String::from("41oVKhMIBZ+oF4efwq7e0A");
        let salt =
            Salt::new(salt_string.clone()).expect("Creating instance of Salt should not fail!");

        assert_eq!(salt_string, salt.as_string());
    }
}
