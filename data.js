const pageData = {
  backgrounds: [
    { id: "pastel-blue", name: "파스텔 블루", image: "Artmug_Basic A Room_Assets/Sample/Pastel Blue.png", color: "#9db9dc" },
    { id: "rose-pink", name: "로즈 핑크", image: "Artmug_Basic A Room_Assets\Sample\Rose Pink.png", color: "#e7acb1" },
    { id: "butter-yellow", name: "버터 옐로우", image: "Artmug_Basic A Room_Assets\Sample\Butter Yellow.png", color: "#dfce91" },
    { id: "jet-black", name: "제트 블랙", image: "Artmug_Basic A Room_Assets\Sample\Jet Black.png", color: "#343437" },
    { id: "lavender-purple", name: "라벤더 퍼플", image: "Artmug_Basic A Room_Assets\Sample\Lavender Purple.png.png", color: "#aaa0dc" },
    { id: "kotori-beige", name: "코토리 베이지", image: "Artmug_Basic A Room_Assets\Sample\Kotori Beige.png", color: "#c3a88e" }
  ],
  times: [
    { id: "day", name: "낮 시간대", image: "Artmug_Basic A Room_Assets/Time/Day.png", color: "#a8c5e9" },
    { id: "night", name: "밤 시간대", image: "Artmug_Basic A Room_Assets/Time/Night.png", color: "#3a4b87" },
    { id: "sunset", name: "노을 시간대", image: "Artmug_Basic A Room_Assets/Time/Sunset.png", color: "#cf9db8" }
  ],
  shapes: [
    { id: "shape-a", name: "A 타입", image: "Artmug_Basic A Room_Assets/Chat/Shape_A.png", color: "#a4a4d9" },
    { id: "shape-b", name: "B 타입", image: "Artmug_Basic A Room_Assets/Chat/Shape_B.png", color: "#a4a4d9" },
    { id: "shape-c", name: "C 타입", image: "Artmug_Basic A Room_Assets/Chat/Shape_C.png", color: "#a4a4d9" }
  ],
  materials: [
    { id: "material-pearl", name: "펄", image: "Artmug_Basic A Room_Assets/Chat/Material_Pearl.png", color: "#b7b2d3" },
    { id: "material-matte", name: "매트", image: "Artmug_Basic A Room_Assets/Chat/Material_Matte.png", color: "#a5a4cf" },
    { id: "material-glossy", name: "글로시", image: "Artmug_Basic A Room_Assets/Chat/Material_Glossy.png", color: "#6979c1" }
  ],
  deliveries: [
    { id: "room", name: "방 전경", image: "Artmug_Basic A Room_Assets/Deliveries/Room.png" },
    { id: "desk-chat", name: "책상 / 채팅창 O", image: "Artmug_Basic A Room_Assets/Deliveries/Desk_Chat O.png" },
    { id: "desk-no-chat", name: "책상 / 채팅창 X", image: "Artmug_Basic A Room_Assets/Deliveries/Desk_Chat X.png" },
    { id: "chat-window", name: "채팅창", image: "Artmug_Basic A Room_Assets/Deliveries/Chat.png" }
  ],
  portfolio: {
    prefix: "Artmug_Basic A Room_Assets/Portfolio/Portfolio_",
    extension: ".png",
    maxItems: 50
  },
  inquiryFields: [
    { id: "activity-name", label: "활동명", description: "방송 활동명을 적어주세요.", type: "text", placeholder: "예: FANCY PLANET" },
    { id: "broadcast-link", label: "방송국 링크", description: "활동 중인 방송 링크를 적어주세요.", type: "url", placeholder: "https://" },
    { id: "background-option", label: "원하시는 배경 및 옵션 선택", description: "원하시는 배경과 옵션을 적어주세요.", type: "textarea", placeholder: "예: 파스텔 블루 / BASIC A ROOM" },
    { id: "neon-sign", label: "네온사인 문구", description: "원하는 폰트 있으실 경우 폰트 이름을 적어주세요.", type: "text", placeholder: "네온사인에 넣을 문구" },
    { id: "time-chat", label: "시간대 / 채팅창 선택", description: "원하는 시간대와 채팅창을 선택해주세요.", type: "select", options: ["선택해주세요", "낮 시간대 / A 타입", "낮 시간대 / B 타입", "낮 시간대 / C 타입", "밤 시간대 / A 타입", "밤 시간대 / B 타입", "밤 시간대 / C 타입", "노을 시간대 / A 타입", "노을 시간대 / B 타입", "노을 시간대 / C 타입"] },
    { id: "window-view", label: "원하는 창밖 풍경", description: "하늘, 해변, 도시 등 간단하게 적어주셔도 좋습니다.", type: "textarea", placeholder: "예: 하늘" },
    { id: "additional-request", label: "추가 요청사항", description: "색상 커스텀 관련 참고자료나 색상 코드가 있다면 함께 적어주세요. 팬캐릭터 제작을 원하실 경우 위치를 알려주세요. 요청사항이 없을 경우 생략하셔도 됩니다.", type: "textarea", placeholder: "추가 요청사항" },
    { id: "portfolio-consent", label: "포트폴리오 이용 동의 여부", description: "포트폴리오 이용 동의 여부를 선택해주세요.", type: "select", options: ["선택해주세요", "동의", "비동의"] }
  ],
  notices: [
    "결제 전 반드시 주의사항 확인 후 문의 부탁드립니다.",
    "모든 작업물의 저작권은 팬시플래닛 스튜디오에 있습니다. 최종 작업물을 방송 배경 이외의 목적으로 사용하거나 2차 가공 및 배포, 제3자에게 판매, 공유 등을 금지합니다. 합방에 이용하실 경우 양측 구매 필수입니다.",
    "최종 작업물은 작가의 포트폴리오 및 홍보물로 이용될 수 있습니다. 원치 않으실 경우 작업 전 말씀해주세요.",
    "단순 변심으로 인한 수정 및 환불은 불가능합니다. 요청사항이 있으시다면 작업이 시작되기 전에 최대한 자세하게 알려주세요.",
    "팬캐릭터, 커스텀 네온사인 제작을 원하신다면 디자인을 확실히 알 수 있는 도안을 필수로 준비해주세요.",
    "고정형 배경의 경우 1회, 주문 제작의 경우 2회 무료 수정이 가능합니다. 최종 작업물 전달 후 한달 이내로 수정을 요청해주세요. 기간 이후의 수정 및 추가 수정, 재작업이 필요한 수정의 경우 추가금이 발생합니다.",
    "주문시 요청하지 않으신 작업에 대해서는 추가금이 발생합니다."
  ]
};
