//
// Created by rev on 12/29/22.
//

#ifndef OWKI_REV_PING_H
#define OWKI_REV_PING_H

typedef void (*rev_call_back) (int i);

void rev_ping(const char *revIpAddress, void (*rev_call_back_func)(char *revRetStr));


#endif //OWKI_REV_PING_H
