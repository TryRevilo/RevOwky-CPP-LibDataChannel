package rev.ca.rev_gen_lib_pers.rev_varags_data;

import android.content.Context;
import android.view.View;

import org.json.JSONObject;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import rev.ca.rev_gen_lib_pers.RevDBModels.RevEntity;
import rev.ca.rev_gen_lib_pers.rev_server_client.rev_pers.rev_entity.RevPersEntityInfoWrapperModel;
import rev.ca.rev_lib_gen_functions.RevLibGenConstantine;

/**
 * Created by rev on 12/20/17.
 */

public class RevVarArgsData {

    private Context mContext = RevLibGenConstantine.REV_CONTEXT;

    private RevEntity revEntity;
    private RevEntity revCurrentParentEntity;

    private RevPersEntityInfoWrapperModel revPersEntityInfoWrapperModel = new RevPersEntityInfoWrapperModel();

    private Long revEntityGUID = -1L;
    private Long revOwnerEntityGUID;
    private Long revContainerEntityGUID = -1L;
    private String revViewType;

    private Map<Object, Object> revVarArgsDataMetadataStrings = new HashMap<>();
    private boolean isPopUpWindow_VARAGS = false;
    private boolean isOverrideFormTitle_VARAGS;
    private boolean isOverrideFormFooter_VARAGS;

    private boolean isRemote = true;

    private JSONObject revJSONData;

    private List<View> revPassViews = new ArrayList<>();

    public RevVarArgsData() {
    }

    public RevVarArgsData(Context mContext) {
        this.mContext = mContext;
    }

    public RevVarArgsData(Long revEntityGUID) {
        this.revEntityGUID = revEntityGUID;
    }

    public RevVarArgsData(String revViewType) {
        this.revViewType = revViewType;
    }

    public RevVarArgsData(Context mContext, Long revEntityGUID) {
        this.mContext = mContext;
        this.revEntityGUID = revEntityGUID;
    }

    public Context getmContext() {
        return mContext;
    }

    public void setmContext(Context mContext) {
        this.mContext = mContext;
    }

    public RevEntity getRevEntity() {
        return revEntity;
    }

    public void setRevEntity(RevEntity revEntity) {
        this.revEntity = revEntity;
    }

    public RevEntity getRevCurrentParentEntity() {
        return revCurrentParentEntity;
    }

    public void setRevCurrentParentEntity(RevEntity revCurrentParentEntity) {
        this.revCurrentParentEntity = revCurrentParentEntity;
    }

    public RevPersEntityInfoWrapperModel getRevPersEntityInfoWrapperModel() {
        return revPersEntityInfoWrapperModel;
    }

    public void setRevPersEntityInfoWrapperModel(RevPersEntityInfoWrapperModel revPersEntityInfoWrapperModel) {
        this.revPersEntityInfoWrapperModel = revPersEntityInfoWrapperModel;
    }

    public Long getRevEntityGUID() {
        return revEntityGUID;
    }

    public void setRevEntityGUID(Long revEntityGUID) {
        this.revEntityGUID = revEntityGUID;
    }

    public Long getRevOwnerEntityGUID() {
        return revOwnerEntityGUID;
    }

    public void setRevOwnerEntityGUID(Long revOwnerEntityGUID) {
        this.revOwnerEntityGUID = revOwnerEntityGUID;
    }

    public Long getRevContainerEntityGUID() {
        return revContainerEntityGUID;
    }

    public void setRevContainerEntityGUID(Long revContainerEntityGUID) {
        this.revContainerEntityGUID = revContainerEntityGUID;
    }

    public String getRevViewType() {
        return revViewType;
    }

    public void setRevViewType(String revViewType) {
        this.revViewType = revViewType;
    }

    public Map<Object, Object> getRevVarArgsDataMetadataStrings() {
        return revVarArgsDataMetadataStrings;
    }

    public void setRevVarArgsDataMetadataStrings(Map<Object, Object> revVarArgsDataMetadataStrings) {
        this.revVarArgsDataMetadataStrings = revVarArgsDataMetadataStrings;
    }

    public boolean isPopUpWindow_VARAGS() {
        return isPopUpWindow_VARAGS;
    }

    public void setPopUpWindow_VARAGS(boolean popUpWindow_VARAGS) {
        isPopUpWindow_VARAGS = popUpWindow_VARAGS;
    }

    public boolean isOverrideFormTitle_VARAGS() {
        return isOverrideFormTitle_VARAGS;
    }

    public void setOverrideFormTitle_VARAGS(boolean overrideFormTitle_VARAGS) {
        isOverrideFormTitle_VARAGS = overrideFormTitle_VARAGS;
    }

    public boolean isOverrideFormFooter_VARAGS() {
        return isOverrideFormFooter_VARAGS;
    }

    public void setOverrideFormFooter_VARAGS(boolean overrideFormFooter_VARAGS) {
        isOverrideFormFooter_VARAGS = overrideFormFooter_VARAGS;
    }

    public boolean isRemote() {
        return isRemote;
    }

    public void setRemote(boolean remote) {
        isRemote = remote;
    }

    public JSONObject getRevJSONData() {
        return revJSONData;
    }

    public void setRevJSONData(JSONObject revJSONData) {
        this.revJSONData = revJSONData;
    }

    public List<View> getRevPassViews() {
        return revPassViews;
    }

    public void setRevPassViews(List<View> revPassViews) {
        this.revPassViews = revPassViews;
    }
}
