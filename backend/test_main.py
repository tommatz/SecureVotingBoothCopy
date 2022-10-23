from fastapi.testclient import TestClient

from main import app

client = TestClient(app)



ballot ={
  "object_id": "5a150c74-a2cb-47f6-b575-165ba8a4ce53",
  "style_id": "harrison-township-ballot-style",
  "contests": [
    {
      "object_id": "justice-supreme-court",
      "sequence_order": 0,
      "ballot_selections": [
        {
          "object_id": "john-adams-selection",
          "sequence_order": 0,
          "vote": 1,
          "is_placeholder_selection": False,
          "extended_data": None
        },
        {
          "object_id": "john-hancock-selection",
          "sequence_order": 2,
          "vote": 1,
          "is_placeholder_selection": False,
          "extended_data": None
        }
      ],
      "extended_data": None
    },
    {
      "object_id": "referendum-pineapple",
      "sequence_order": 1,
      "ballot_selections": [
        {
          "object_id": "referendum-pineapple-affirmative-selection",
          "sequence_order": 0,
          "vote": 1,
          "is_placeholder_selection": False,
          "extended_data": None
        }
      ],
      "extended_data": None
    }
  ]
}


def test_post():
    test1_response = {
    "justice-supreme-court": {
        "john-adams-selection": 1,
        "john-hancock-selection": 1
    },
    "referendum-pineapple": {
        "referendum-pineapple-affirmative-selection": 1
    }
    }
    response = client.post("/voter/send_vote", json=ballot)
    assert response.status_code == 200
    assert response.json() == test1_response
    
def bad_post():
    test1_response = {
    "justice-supreme-court": {
        "john-adams-selection": 1,
        "john-hancock-selection": 1
    },
    "referendum-pineapple": {
        "referendum-pineapple-affirmative-seletion": 1
    }
    }    
    assert response.status_code == 422
       
def test_get():
    client.post("/voter/send_vote", json=ballot)
    client.post("/voter/send_vote", json=ballot)
    response = client.get("/voter/get_tally?contest=justice-supreme-court&candidate=john-adams-selection")
    assert response.status_code == 200
    assert response.json() == 3
