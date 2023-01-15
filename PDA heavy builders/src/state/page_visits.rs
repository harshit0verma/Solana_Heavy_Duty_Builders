use borsh::{ BorshDeserialize, BorshSerialize };


#[derive(BorshDeserialize, BorshSerialize, Debug)]
pub struct IncrementPageVisits {}

#[derive(BorshDeserialize, BorshSerialize, Debug)]
pub enum MyEnum {
    Harshit0verma,
    Harshitverma,
    Vermaharshitji
}

#[derive(BorshDeserialize, BorshSerialize, Debug)]
pub struct PageVisits {
    pub my_enum : MyEnum,
    pub page_visits: u64,
    pub bump: u8,
}

impl PageVisits {

    pub const ACCOUNT_SPACE: usize = 8 + 64 + 1 + 64;

    pub const SEED_PREFIX: &'static str = "page_visits";

    pub fn new(my_enum : MyEnum, page_visits: u64, bump: u8) -> Self {
        PageVisits {
            my_enum,
            page_visits,
            bump,
        }
    }


    // let my_struct = PageVisits {
    // my_enum: MyEnum::harshitverma,
    // page_visits: 01,
    // };

    pub fn increment(&mut self) {
        self.my_enum = MyEnum::Harshitverma;
        self.page_visits = 123;
        // self.Myenum
        // self.page_visits += 1;
    }
}