user_info = {}
sid_reference ={}
rooms_info = {}


# structure of dictionary

# user_info = {
#   user_id-1 (int) : {
#       sid: XXX,
#       username: XXX,
#       email: XXX
#   },
#   user_id-2 (int) : {
#       sid: XXX,
#       username: XXX,
#       email: XXX
#   }
# }


# sid_reference = {
#   sid-1 : user_id-1,
#   sid-2 : user_id-2,
# }


# rooms_info = {
#   room_id-1: {
#       sid-1 : {username: XXX,
#              coords: [old_Postion, new_postion]
#             },
#       sid-2 : {username: XXX,
#              coords: [old_Postion, new_postion]
#             },
#   room_id-2: {
#       sid-1 : {username: XXX,
#              coords: [old_Postion, new_postion]
#             },
#       sid-2 : {username: XXX,
#              coords: [old_Postion, new_postion]
#             },
# }