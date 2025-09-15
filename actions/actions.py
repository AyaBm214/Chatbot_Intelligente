from typing import Any, Text, Dict, List
from rasa_sdk import Action, Tracker
from rasa_sdk.executor import CollectingDispatcher
from rasa_sdk.events import EventType


class ActionAfficherDates(Action):

    def name(self) -> Text:
        return "action_afficher_dates"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[EventType]:

        dispatcher.utter_message(text="Voici les prochaines échéances du PFE. Pour plus de détails, consulte la plateforme PFE.")
        return []
