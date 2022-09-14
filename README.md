# Hyperledger-network

## 개발배경 및 목적
블록체인은 개인 간 거래 정보를 중앙 서버가 아닌 모든 참가자들의 네트워크에 공유 하는 ‘분산형 디지털 장부’ 기술이다.
이 기술은 거래 정보를 암호화된 개별 블록으로 체인형식으로 엮어 모든 참가자들에게 저장하는 방식이다.
이런 특징을 갖고 있어 블록체인은 해커와 같은 악의적인 유저가 한 블록에 침투하더라도 나머지 블록 모두 위변조하기가 어려워 보안 측면에서 주목을 받고 본인인증 시에 많이 쓰이고 있다.
따라서 프로젝트에서는 블록체인을 활용해 특수한 상황인 인증서가 아닌 실생활에 접목해 사용할 방법을 찾아 연구할 계획이다.

## 개발환경 및 개발언어
1. Go - 1.16.5 linux/amd64
2. Hyperledger Fabric Chaincode 
3. Finger print image compare  - Python 2.7, 3.7
4. Node - 12.22.10
5. Docker - 20.10.12
6. Docker Compose - 1.27.2

## 오픈소스 출처
https://github.com/hyperledger/fabric-samples
