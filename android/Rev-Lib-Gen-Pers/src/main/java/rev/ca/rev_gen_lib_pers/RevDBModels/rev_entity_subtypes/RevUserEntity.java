package rev.ca.rev_gen_lib_pers.RevDBModels.rev_entity_subtypes;

import java.sql.Timestamp;

import rev.ca.rev_gen_lib_pers.RevDBModels.RevEntity;

/**
 * Created by rev on 1/1/18.
 */

public class RevUserEntity extends RevEntity {

    private String _fullNames = "";
    private String _password = "";
    private String _email = "";
    private String _language = "";
    private long _sessionCode = -1l;

    private Timestamp _lastActionTime;
    private Timestamp _prevLastAction;
    private Timestamp _lastLogin;
    private Timestamp _prevLastLogin;

    public RevUserEntity() {}

    public String get_fullNames() {
        return _fullNames;
    }

    public void set_fullNames(String _fullNames) {
        this._fullNames = _fullNames;
    }

    public String get_password() {
        return _password;
    }

    public void set_password(String _password) {
        this._password = _password;
    }

    public String get_email() {
        return _email;
    }

    public void set_email(String _email) {
        this._email = _email;
    }

    public String get_language() {
        return _language;
    }

    public void set_language(String _language) {
        this._language = _language;
    }

    public long get_sessionCode() {
        return _sessionCode;
    }

    public void set_sessionCode(long _sessionCode) {
        this._sessionCode = _sessionCode;
    }

    public Timestamp get_lastActionTime() {
        return _lastActionTime;
    }

    public void set_lastActionTime(Timestamp _lastActionTime) {
        this._lastActionTime = _lastActionTime;
    }

    public Timestamp get_prevLastAction() {
        return _prevLastAction;
    }

    public void set_prevLastAction(Timestamp _prevLastAction) {
        this._prevLastAction = _prevLastAction;
    }

    public Timestamp get_lastLogin() {
        return _lastLogin;
    }

    public void set_lastLogin(Timestamp _lastLogin) {
        this._lastLogin = _lastLogin;
    }

    public Timestamp get_prevLastLogin() {
        return _prevLastLogin;
    }

    public void set_prevLastLogin(Timestamp _prevLastLogin) {
        this._prevLastLogin = _prevLastLogin;
    }
}
